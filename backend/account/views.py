import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from djoser.email import ActivationEmail
from django.db import transaction

from .models import UserAccess
from .tasks import async_send
from .serializers import AddSpaceAccessToUserSerializer, SpaceListSerializer, \
    SpaceSerializer, UserAccessSerializer, UserSerializer


class UserActivationView(APIView):
    permission_classes = [AllowAny]
    def get (self, request, uid, token):
        protocol = 'https://' if request.is_secure() else 'http://'
        web_url = protocol + 'localhost:8000'
        post_url = web_url + "/auth/users/activation/?uid=(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$'"
        post_data = {'uid': uid, 'token': token}
        result = requests.post(post_url, data = post_data)
        content = result.text
        if not content:
            return Response({'message': 'The user is activated'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Something went wrong in activation user'}, status=status.HTTP_403_FORBIDDEN)
            

class ChangeCurrentSpaceViewSet(APIView):
    def post(self, request, space_id):
        current_user = request.user
        if current_user.spaces.filter(id = space_id).exists():
            current_user.current_space_id = space_id
            current_user.save()
            return Response({'message': 'The current space of user is changed successfully'})
        else:
            return Response({"message": "The space does not exists in the user's spaces."}, status=status.HTTP_400_BAD_REQUEST)
        
class CustomActivationEmail(ActivationEmail):
    template_name = "email/activation.html"
    def send(self, to):
        print('sending email with celery')
        context = self.get_context_data()
        context['user'] = UserSerializer(context['user']).data
        url = context['url']
        to = context['user']['email']
        protocol = context['protocol']
        async_send.delay(url, to, protocol)


class SpaceViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return SpaceSerializer   
        else:
            return SpaceListSerializer
    def get_queryset(self):
        current_user = self.request.user
        if current_user.spaces is not None:
            return current_user.spaces.all()

class UserAccessViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddSpaceAccessToUserSerializer
        return UserAccessSerializer
    def get_queryset(self):
        return UserAccess.objects \
        .filter(space_id = self.kwargs['space_pk']) \
        .select_related('user')


    def get_serializer_context(self):
        return {'space_id': self.kwargs['space_pk']}

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        current_user = self.request.user

        if current_user.id != instance.space.owner_id:
            return Response({"message": "The user does not access to delete memeber"}, status=status.HTTP_403_FORBIDDEN)
        
        if instance.user_id == instance.space.owner_id:
            return Response({"message": "The owner of the space can not be removed"}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(instance)
        if instance.space.id == instance.user.current_space_id:
            instance.user.current_space_id = None
            instance.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


    

