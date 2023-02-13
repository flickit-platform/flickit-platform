from datetime import timedelta, datetime
from django.utils import timezone
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response

from account.services import userservices

from baseinfo.models.profilemodels import ExpertGroup, ExpertGroupAccess
from baseinfo.tasks import async_send_invite_for_expert_group
from baseinfo.services import cryptoservices
from baseinfo.services.cryptoservices import ValidateTokenException

def load_expert_group(expert_group_id) -> ExpertGroup:
    try:
        return ExpertGroup.objects.get(id = expert_group_id)
    except ExpertGroup.DoesNotExist:
        raise ExpertGroup.DoesNotExist

def add_expert_group_coordinator(expert_group, current_user):
    try:
        expert_group_access = ExpertGroupAccess.objects.get(expert_group_id = expert_group.id, user_id = current_user.id)
    except ExpertGroupAccess.DoesNotExist:
        expert_group_access = ExpertGroupAccess.objects.create(user_id = current_user.id, expert_group_id = expert_group.id)
        expert_group_access.save()
    expert_group.save()
    expert_group_access.save()

def add_user_to_expert_group(expert_group_id, email):
    expert_group = load_expert_group(expert_group_id)
    user = userservices.load_user_by_email(email)
    if user in expert_group.users.all():
        return False
    token = cryptoservices.encrypt_message(str(user.id) + ' ' + str(expert_group.id))
    url = 'account/expert-group-invitation/' + str(expert_group.id) + '/' + str(token)
    async_send_invite_for_expert_group.delay(url , email)
    create_expert_group_access_temp_record(expert_group_id, email)
    return True

def create_expert_group_access_temp_record(expert_group_id, email):
    try:
        user_access = ExpertGroupAccess.objects.get(invite_email = email, expert_group_id = expert_group_id)
        user_access.invite_expiration_date = timezone.now() + timedelta(days=7)
        user_access.save()
    except ExpertGroupAccess.DoesNotExist:
        ExpertGroupAccess.objects.create(invite_email = email, expert_group_id = expert_group_id, invite_expiration_date =  timezone.now() + timedelta(days=7))

def confirm_user_for_registering_in_expert_group(token, current_user_id):
    decrypted_message = decrypt_message(token)
    info_ids = decrypted_message.split()
    user_id = info_ids[0].decode()
    if user_id != str(current_user_id):
        return False
    user = userservices.load_user(user_id)
    add_invited_user_to_expert_group(user)
    return True

def decrypt_message(token):
    decrypt_message = ''
    try:
        decrypt_message = cryptoservices.decrypt_message(token)
    except:
        raise ValidateTokenException
    return decrypt_message


def add_invited_user_to_expert_group(user):
    expert_accesses = ExpertGroupAccess.objects.filter(invite_email = user.email, invite_expiration_date__gt=datetime.now())
    if expert_accesses.count() == 0:
        expire_expert_accesses = ExpertGroupAccess.objects.filter(invite_email = user.email)
        for eea in expire_expert_accesses:
            eea.delete()
    for ua in expert_accesses:
        ua.user = user
        ua.invite_email = None
        ua.invite_expiration_date = None
        ua.save()

def perform_delete(instance: ExpertGroupAccess, current_user):
    if current_user.id != instance.expert_group.owner_id:
        return Response({"message": "The user does not access to delete memeber"}, status=status.HTTP_403_FORBIDDEN)
    
    if instance.user_id == instance.expert_group.owner_id:
        return Response({"message": "The owner of the expert group can not be removed"}, status=status.HTTP_400_BAD_REQUEST)
    instance.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

def remove_expire_invitions(user_expert_group_access_list):
    user_expert_group_access_list_id = [obj['id'] for obj in user_expert_group_access_list]
    qs = ExpertGroupAccess.objects.filter(id__in=user_expert_group_access_list_id)
    expire_list = qs.filter(invite_expiration_date__lt=datetime.now())
    for expire in expire_list.all():
        ExpertGroupAccess.objects.get(id = expire.id).delete()


def validate_website(website):
    if not website:
        return website
    if not website.startswith("http://") and not website.startswith("https://"):
        if "." not in website:
            raise ValidationError("Invalid URL")
        website = "http://" + website
    try:
        URLValidator(schemes=['http', 'https'])(website)
        return website
    except ValidationError:
        raise ValidationError("Invalid URL")
    
def is_current_user_expert(expert_group, user):
    return expert_group.users.filter(pk=user.pk).exists() and user.has_perm('baseinfo.manage_expert_group')

    