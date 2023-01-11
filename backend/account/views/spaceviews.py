
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from ..serializers.spaceserializers import SpaceListSerializer, InputSpaceAccessSerializer
from ..serializers.commonserializers import SpaceSerializer
from ..services import spaceservices, userservices

class ChangeCurrentSpaceViewSet(APIView):
    def post(self, request, space_id):
        return spaceservices.change_current_space(request.user, space_id)


class SpaceAccessAPI(APIView):
    serializer_class = InputSpaceAccessSerializer
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
