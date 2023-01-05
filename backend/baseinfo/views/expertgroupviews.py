from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from ..serializers.expertgroupserializers import ExpertGroupSerilizer, ExpertGroupCreateSerilizers, ExpertGroupListSerilizers
from ..services import expertgroupservice
from account.services import userservices
from ..models.profilemodels import ExpertGroup


class ExpertGroupViewSet(ModelViewSet):
    serializer_class = ExpertGroupSerilizer

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return ExpertGroupCreateSerilizers
        elif self.request.method in ['GET']:
            return ExpertGroupListSerilizers
        return ExpertGroupSerilizer

    def get_queryset(self):
        return ExpertGroup.objects.all()


class AddUserToExpertGroupApi(APIView):
    def post(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        if expert_group is None:
            return Response({'message: expert_group with id {} is not Valid', expert_group_id}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data['email']
        user = userservices.load_user_by_email(email)
        if user is None:
            return Response({'message: user with email {} is not found'.format(email)}, status=status.HTTP_400_BAD_REQUEST)
        expert_group.users.add(user)
        expert_group.save()
        return Response({'message: User with email {} is added to expert group'.format(email)}, status=status.HTTP_200_OK)

        
        
