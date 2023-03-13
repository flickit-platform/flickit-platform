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
from account.serializers.userserializers import UserAccessSerializer, UserCustomSerializer, UserCreateSerializer, UserSerializer
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
    def get (self, request, uid, token):
        protocol = 'https://' if request.is_secure() else 'http://'
        web_url = protocol + 'localhost:8000'
        post_url = web_url + "/authinfo/users/activation/?uid=(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$'"
        post_data = {'uid': uid, 'token': token}
        result = requests.post(post_url, data = post_data)
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
        async_send.delay(url, to, protocol)


class UserAccessViewSet(ModelViewSet):
    http_method_names = ['get', 'delete']
    serializer_class = UserAccessSerializer

    def get_queryset(self):
        return UserAccess.objects.filter(space_id = self.kwargs['space_pk']).select_related('user')

    def get_serializer_context(self):
        return {'space_id': self.kwargs['space_pk']}

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        result =  spaceservices.perform_delete(self.get_object(), request.user)
        if not result:
            return Response({"message": "The owner of the space can not be removed"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @transaction.atomic
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.status_code == 200:
            spaceservices.remove_expire_invitions(response.data['results'])
        return super().list(request, *args, **kwargs)


class InviteMemberForSpaceApi(APIView):
    serializer_class =  InviteMemberSerializer
    def post(self, request, space_id):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        userservices.invite_member_for_space(space_id, **serializer.validated_data)
        return Response(status=status.HTTP_200_OK)
       



    

