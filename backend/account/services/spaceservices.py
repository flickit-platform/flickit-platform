from ..services import userservices
from ..models import UserAccess
from rest_framework.response import Response
from rest_framework import status


def add_user_to_space(space_id, email):
    user = userservices.load_user_by_email(email)
    try:
        user_access = UserAccess.objects.get(space_id = space_id, user = user)
        user_access.save()
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(space_id = space_id, user = user)

def add_invited_user_to_space(user):
    user_accesses = UserAccess.objects.filter(invite_email = user.email)
    for ua in user_accesses:
        ua.user = user
        ua.invite_email = None
        ua.save()


def perform_delete(instance: UserAccess, current_user):
    if current_user.id != instance.space.owner_id:
        return Response({"message": "The user does not access to delete memeber"}, status=status.HTTP_403_FORBIDDEN)
    
    if instance.user_id == instance.space.owner_id:
        return Response({"message": "The owner of the space can not be removed"}, status=status.HTTP_400_BAD_REQUEST)
    instance.delete()
    if instance.space.id == instance.user.current_space_id:
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



