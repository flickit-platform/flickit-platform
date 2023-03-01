import random
import string
from datetime import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from account.services import userservices
from account.models import UserAccess, User, Space


def add_user_to_space(space_id, email):
    user = userservices.load_user_by_email(email)
    try:
        UserAccess.objects.get(space_id = space_id, user = user)
        return Response({"message": "The invited user has already existed in the space"}, status=status.HTTP_400_BAD_REQUEST)
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(space_id = space_id, user = user)
        return Response(status=status.HTTP_200_OK)
    
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
        return Response({"message": "The owner of the space can not be removed"}, status=status.HTTP_400_BAD_REQUEST)
    instance.delete()
    if instance.user is not None and instance.space.id == instance.user.current_space_id:
        instance.user.current_space_id = None
        instance.user.save()
    return Response(status=status.HTTP_204_NO_CONTENT)

def change_current_space(current_user, space_id):
    if current_user.spaces.filter(id = space_id).exists():
        current_user.current_space_id = space_id
        current_user.save()
        return Response({'message': 'The current space of user is changed successfully'})
    else:
        return Response({"message": "The space does not exists in the user's spaces."}, status=status.HTTP_400_BAD_REQUEST)

def remove_expire_invitions(user_space_access_list):
    user_space_access_list_id = [obj['id'] for obj in user_space_access_list]
    qs = UserAccess.objects.filter(id__in=user_space_access_list_id)
    expire_list = qs.filter(invite_expiration_date__lt=datetime.now())
    for expire in expire_list.all():
        UserAccess.objects.get(id = expire.id).delete()



