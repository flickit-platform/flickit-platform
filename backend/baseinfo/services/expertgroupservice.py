from rest_framework import status
from rest_framework.response import Response
from account.services import userservices
from ..models.profilemodels import ExpertGroup
from ..tasks import async_send_invite_for_expert_group
from ..services import cryptoservices, expertgroupservice


def load_expert_group(expert_group_id) -> ExpertGroup:
    try:
        return ExpertGroup.objects.get(id = expert_group_id)
    except ExpertGroup.DoesNotExist:
        return None

def add_expert_group_coordinator(expert_group, current_user):
    try:
        expert_group = ExpertGroup.objects.get(expert_group_id = expert_group.id, user_id = current_user.id)
    except ExpertGroup.DoesNotExist:
        user_access = ExpertGroup.objects.create(user_id = current_user.id, expert_group_id = expert_group.id)
        user_access.save()
    expert_group.owner = current_user
    expert_group.save()
    return expert_group


def add_user_to_expert_group(expert_group_id, email):
    expert_group = load_expert_group(expert_group_id)
    if expert_group is None:
        return Response({'message': 'expert_group with id {} is not Valid'.format(expert_group.id)}, status=status.HTTP_400_BAD_REQUEST)
    user = userservices.load_user_by_email(email)
    if user in expert_group.users.all():
        return Response({'message': 'User with email {} is member of expert group'.format(email)}, status=status.HTTP_400_BAD_REQUEST)
    print('sending email with celery for add member to expert group')
    token = cryptoservices.encrypt_message(str(user.id) + ' ' + str(expert_group.id))
    url = 'baseinfo/expertgroup/confirm/' + str(token)
    async_send_invite_for_expert_group.delay(url , email)
    message = 'An invitation is send successfully for user with email {email}'.format(email = email)
    return Response({'message': message}, status=status.HTTP_200_OK)

def confirm_user_for_registering_in_expert_group(token, current_user_id):
    decrypt_message = ''
    try:
        decrypt_message = cryptoservices.decrypt_message(token)
    except:
        return Response({'message': 'The token is not vliad for registering in expert group'}, status=status.HTTP_403_FORBIDDEN)

    info_ids = decrypt_message.split()
    user_id = info_ids[0].decode()
    expert_group_id = info_ids[1].decode()
    if user_id != str(current_user_id):
        return Response({'message': 'The user is not permitted for registering in expert group'}, status=status.HTTP_403_FORBIDDEN)

    user = userservices.load_user(user_id)
    expert_group = expertgroupservice.load_expert_group(expert_group_id)
    expert_group.users.add(user)

    return Response({'message': 'User is added successfully for expert group {}'.format(expert_group_id)}, status=status.HTTP_200_OK) 
    