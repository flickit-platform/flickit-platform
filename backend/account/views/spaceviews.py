
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from ..serializers.spaceserializers import SpaceListSerializer, InputSpaceAccessSerializer
from ..serializers.commonserializers import SpaceSerializer
from ..services import spaceservices

class ChangeCurrentSpaceViewSet(APIView):
    def post(self, request, space_id):
        current_user = request.user
        if current_user.spaces.filter(id = space_id).exists():
            current_user.current_space_id = space_id
            current_user.save()
            return Response({'message': 'The current space of user is changed successfully'})
        else:
            return Response({"message": "The space does not exists in the user's spaces."}, status=status.HTTP_400_BAD_REQUEST)

class SpaceAccessAPI(APIView):
    serializer_class = InputSpaceAccessSerializer
    # user_response = openapi.Response('response description', UserSerializer)
    # @swagger_auto_schema(request_body=InputSpaceAccessSerializer, responses={200: user_response})
    def post(self, request, space_id):
        serializer = InputSpaceAccessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        spaceservices.add_user_to_space(space_id, **serializer.validated_data)
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
