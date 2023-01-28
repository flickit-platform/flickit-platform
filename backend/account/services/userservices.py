from ..models import User, UserAccess
from ..tasks import async_send_invite
from django.db import transaction
from datetime import timedelta
from django.utils import timezone


def load_user_by_email(email) -> User:
    try:
        return User.objects.filter(email=email).first()
    except User.DoesNotExist:
        return None

def load_user(user_id) -> User:
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

@transaction.atomic
def invite_member_for_space(space_id, email):
    print('sending email with celery for inviting member')
    url = 'sign-up/'
    to = email
    protocol = 'https'
    async_send_invite.delay(url, to, protocol)
    create_user_access_temp_record(space_id, email)

def create_user_access_temp_record(space_id, email):
    try:
        user_access = UserAccess.objects.get(invite_email = email, space_id = space_id)
        user_access.invite_expiration_date = timezone.now() + timedelta(seconds=7)
        user_access.save()
    except UserAccess.DoesNotExist:
        UserAccess.objects.create(invite_email = email, space_id = space_id, invite_expiration_date =  timezone.now() + timedelta(seconds=7))