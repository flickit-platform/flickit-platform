import random
import string
from datetime import datetime
from rest_framework.exceptions import PermissionDenied

from common.restutil import ActionResult
from account.services import userservices
from account.models import UserAccess, User, Space


def add_user_to_space(space_id, email):
    user = userservices.load_user_by_email(email)
    try:
        UserAccess.objects.get(space_id = space_id, user = user)
        return False
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(space_id = space_id, user = user)
        return True
    
def create_default_space(user:User):
    alphabet = string.digits
    space = Space()
    space.code = ''.join(random.choice(alphabet) for _ in range(6))
    space.title = user.display_name + '_default_space'
    space.owner = user
    space.save()
    add_owner_to_space(space, user.id)
    add_invited_user_to_space(user)

def add_owner_to_space(space, current_user_id):
    try:
        user_access = UserAccess.objects.get(space_id = space.id, user_id = current_user_id)
    except UserAccess.DoesNotExist:
        user_access = UserAccess.objects.create(user_id = current_user_id, space_id = space.id)
        user_access.save()
    space.owner_id = current_user_id
    space.save()
    return space

def add_invited_user_to_space(user):
    user_accesses = UserAccess.objects.filter(invite_email = user.email, invite_expiration_date__gt=datetime.now())
    if user_accesses.count() == 0:
        expire_user_accesses = UserAccess.objects.filter(invite_email = user.email)
        for eua in expire_user_accesses:
            eua.delete()
    for ua in user_accesses:
        ua.user = user
        ua.invite_email = None
        ua.invite_expiration_date = None
        ua.save()

def perform_delete(instance: UserAccess, current_user):
    if current_user.id != instance.space.owner_id:
        raise PermissionDenied
    
    if instance.user_id == instance.space.owner_id:
        return False
    instance.delete()
    if instance.user is not None and instance.space.id == instance.user.current_space_id:
        instance.user.current_space_id = None
        instance.user.save()
    return True

def change_current_space(current_user, space_id):
    if current_user.spaces.filter(id = space_id).exists():
        current_user.current_space_id = space_id
        current_user.save()
        return True
    else:
        return False

def remove_expire_invitions(user_space_access_list):
    user_space_access_list_id = [obj['id'] for obj in user_space_access_list]
    qs = UserAccess.objects.filter(id__in=user_space_access_list_id)
    expire_list = qs.filter(invite_expiration_date__lt=datetime.now())
    for expire in expire_list.all():
        UserAccess.objects.get(id = expire.id).delete()


def exit_user_the_space(space_id, current_user):
    try:
        space_user_access = UserAccess.objects.get(space_id = space_id, user = current_user)
        space_user_access.delete()
        return ActionResult(success=True, message='Leaving from the space is done successfully')
    except UserAccess.DoesNotExist:
        return ActionResult(success=False, message='There is no such user and space')



