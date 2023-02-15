from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from baseinfo.serializers import expertgroupserializers 
from baseinfo.services import expertgroupservice
from baseinfo.models.profilemodels import ExpertGroup, ExpertGroupAccess
from baseinfo.permissions import ManageExpertGroupPermission


class ExpertGroupViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return expertgroupserializers.ExpertGroupCreateSerilizers
        return expertgroupserializers.ExpertGroupSerilizer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            return ExpertGroup.objects.filter(users__id=user_id).prefetch_related('users').all()
        return ExpertGroup.objects.all()

class ExpertGroupAccessViewSet(ModelViewSet):
    http_method_names = ['get', 'delete']
    serializer_class = expertgroupserializers.ExpertGroupAccessSerializer

    def get_queryset(self):
        return ExpertGroupAccess.objects.filter(expert_group_id = self.kwargs['expertgroup_pk']).select_related('user')

    def get_serializer_context(self):
        return {'expert_group_id': self.kwargs['expertgroup_pk']}

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        return expertgroupservice.perform_delete(self.get_object(), request.user)

    @transaction.atomic
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if response.status_code == 200:
            expertgroupservice.remove_expire_invitions(response.data['results'])
        return super().list(request, *args, **kwargs)


class AddUserToExpertGroupApi(APIView):
    serializer_class = expertgroupserializers.ExpertGroupGiveAccessSerializer
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def post(self, request, expert_group_id):
        serializer = expertgroupserializers.ExpertGroupGiveAccessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = expertgroupservice.add_user_to_expert_group(expert_group_id, **serializer.validated_data)
        email = serializer.validated_data['email']
        if not result:
            error_message = 'User with email {} is member of expert group'.format(email)
            return Response({'message': error_message}, status=status.HTTP_400_BAD_REQUEST)
        message = 'An invitation has been sent successfully to user with email {email}'.format(email = email)
        return Response({'message': message})
        

class ConfirmUserForExpertGroupApi(APIView):
    def post(self, request, token):
        result =  expertgroupservice.confirm_user_for_registering_in_expert_group(token, request.user.id)
        if not result:
            error_message = 'The user is not permitted for registering in expert group'
            return Response({'message': error_message}, status=status.HTTP_403_FORBIDDEN)
        return Response({'message': 'User is added successfully to expert group'}) 
        

    


        
        
