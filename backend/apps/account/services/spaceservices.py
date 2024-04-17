from datetime import datetime
from django.db import transaction
from rest_framework.exceptions import PermissionDenied

from common.restutil import ActionResult
from account.services import userservices
from account.models import UserAccess, Space


@transaction.atomic
def add_user_to_space(space_id, current_user, email):
    user = userservices.load_user_by_email(email)
    space = Space.objects.get(id=space_id)
    if current_user not in space.users.all():
        return ActionResult(success=False, code='user-not-allowed',
                            message='Only members of the space are allowed to add new members to it.')
    try:
        UserAccess.objects.get(space_id=space_id, user=user)
        return ActionResult(success=False, code='user-is-member',
                            message='This user is already a member of this space.')
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(space_id=space_id, user=user, created_by=current_user)
        return ActionResult(success=True, code='user-joined-space',
                            message='This user has successfully joined the space.')


@transaction.atomic
def add_owner_to_space(space, current_user):
    try:
        user_access = UserAccess.objects.get(space=space, user=current_user)
    except UserAccess.DoesNotExist:
        user_access = UserAccess.objects.create(user=current_user, space=space, created_by=current_user)
        user_access.save()
    return space


@transaction.atomic
def add_invited_user_to_space(user):
    user_accesses = UserAccess.objects.filter(invite_email=user.email, invite_expiration_date__gt=datetime.now())
    if user_accesses.count() == 0:
        expire_user_accesses = UserAccess.objects.filter(invite_email=user.email)
        for eua in expire_user_accesses:
            eua.delete()
    for ua in user_accesses:
        ua.user = user
        ua.invite_email = None
        ua.invite_expiration_date = None
        ua.save()


@transaction.atomic
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


@transaction.atomic
def change_current_space(current_user, space_id):
    if current_user.spaces.filter(id=space_id).exists():
        current_user.current_space_id = space_id
        current_user.save()
        return ActionResult(success=True, message='The current space of user is changed successfully.')
    else:
        return ActionResult(success=False, message="The space does not exists in the user's spaces.")


@transaction.atomic
def remove_expire_invitions(user_space_access_list):
    user_space_access_list_id = [obj['id'] for obj in user_space_access_list]
    qs = UserAccess.objects.filter(id__in=user_space_access_list_id)
    expire_list = qs.filter(invite_expiration_date__lt=datetime.now())
    for expire in expire_list.all():
        UserAccess.objects.get(id=expire.id).delete()


@transaction.atomic
def leave_user_space(space_id, current_user):
    try:
        space_user_access = UserAccess.objects.get(space_id=space_id, user=current_user)
        space = Space.objects.get(id=space_id)
        if space.owner == current_user:
            return ActionResult(success=False, message="Not allowed to perform this action. ")
        space_user_access.delete()
        return ActionResult(success=True, message='Leaving from the space is done successfully.')
    except UserAccess.DoesNotExist:
        return ActionResult(success=False, message='There is no such user or space')
