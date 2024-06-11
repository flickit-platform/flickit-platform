import requests
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from djoser.email import ActivationEmail
from djoser.views import UserViewSet

from account.models import UserAccess
from account.tasks import async_send
from account.serializers.userserializers import UserCustomSerializer, UserCreateSerializer, UserSerializer
from account.serializers.spaceserializers import InviteMemberSerializer
from account.services import spaceservices, userservices
from djoser.views import UserViewSet


class CustomUserViewSet(UserViewSet):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserCreateSerializer
        elif self.request.method == 'PUT':
            return UserSerializer
        return UserCustomSerializer

    def perform_update(self, serializer):
        send_activation_email = False  # Set this to False to disable activation email
        serializer.save(send_activation_email=send_activation_email)


class UserActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uid, token):
        protocol = 'https://' if request.is_secure() else 'http://'
        web_url = 'http://localhost:8000'
        print('protocol:' + protocol)
        print('before call')
        post_url = web_url + "/authinfo/users/activation/?uid=(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$'"
        post_data = {'uid': uid, 'token': token}
        result = requests.post(post_url, data=post_data)
        print('after call')
        content = result.text
        if not content:
            return Response({'message': 'The user is activated'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Something went wrong in activation user'}, status=status.HTTP_403_FORBIDDEN)


class CustomActivationEmail(ActivationEmail):
    template_name = "email/activation.html"

    def send(self, to):
        print('sending email with celery')
        context = self.get_context_data()
        context['user'] = UserCustomSerializer(context['user']).data
        url = context['url']
        to = context['user']['email']
        protocol = context['protocol']
        display_name = context['user']['display_name']
        async_send.delay(url, to, protocol, display_name)


class InviteMemberForSpaceApi(APIView):
    serializer_class = InviteMemberSerializer

    def post(self, request, space_id):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        userservices.invite_member_for_space(space_id, request.user.display_name, **serializer.validated_data)
        return Response(status=status.HTTP_200_OK)
