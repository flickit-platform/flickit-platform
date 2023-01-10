from ..services import userservices
from ..models import UserAccess

def add_user_to_space(space_id, email):
    user = userservices.load_user_by_email(email)
    try:
        user_access = UserAccess.objects.get(space_id = space_id, user = user)
        user_access.save()
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(space_id = space_id, user = user)
