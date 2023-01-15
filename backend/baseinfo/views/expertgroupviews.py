from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from ..serializers.expertgroupserializers import ExpertGroupSerilizer, ExpertGroupCreateSerilizers, ExpertGroupAccessSerializer
from ..services import expertgroupservice
from ..models.profilemodels import ExpertGroup


class ExpertGroupViewSet(ModelViewSet):
   
    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT']:
            return ExpertGroupCreateSerilizers
        return ExpertGroupSerilizer

    def get_queryset(self):
        return ExpertGroup.objects.all()


class AddUserToExpertGroupApi(APIView):
    serializer_class = ExpertGroupAccessSerializer
    def post(self, request, expert_group_id):
        serializer = ExpertGroupAccessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return expertgroupservice.add_user_to_expert_group(expert_group_id, **serializer.validated_data)

class ConfirmUserForExpertGroupApi(APIView):
    def post(self, request, token):
        return expertgroupservice.confirm_user_for_registering_in_expert_group(token, request.user.id)

    


        
        
