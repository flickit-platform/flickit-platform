
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from rest_framework import status
from rest_framework.response import Response

from account.serializers.spaceserializers import SpaceListSerializer, InputSpaceAccessSerializer,InputSpaceExitSerializer
from account.serializers.commonserializers import SpaceSerializer
from account.services import spaceservices

class ChangeCurrentSpaceViewSet(APIView):
    def post(self, request, space_id):
        result = spaceservices.change_current_space(request.user, space_id)
        if not result:
            return Response({"message": "The space does not exists in the user's spaces."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'The current space of user is changed successfully'})
        

class SpaceAccessAPI(APIView):
    serializer_class = InputSpaceAccessSerializer
    def post(self, request, space_id):
        serializer = InputSpaceAccessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result =  spaceservices.add_user_to_space(space_id, **serializer.validated_data)
        if not result:
             return Response({"message": "The invited user has already existed in the space"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

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

class SpaceExitUserApi(APIView):
    def post(self, request, space_id):
        result = spaceservices.exit_user_the_space(space_id, request.user)
        if result.success:
            return Response({'message': result.message})
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)
