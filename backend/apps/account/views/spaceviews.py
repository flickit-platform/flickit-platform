from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

from rest_framework import status
from rest_framework.response import Response

from account.serializers.spaceserializers import InputSpaceAccessSerializer
from account.serializers.commonserializers import SpaceSerializer
from account.services import spaceservices


class ChangeCurrentSpaceViewSet(APIView):
    def post(self, request, space_id):
        result = spaceservices.change_current_space(request.user, space_id)
        if result.success:
            return Response({'message': result.message})
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)


class SpaceAccessAPI(APIView):
    serializer_class = InputSpaceAccessSerializer

    def post(self, request, space_id):
        serializer = InputSpaceAccessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'code': 'user-not-exist', 'message': 'No user with the given email was found.'},
                            status=status.HTTP_400_BAD_REQUEST)
        result = spaceservices.add_user_to_space(space_id, request.user, **serializer.validated_data)
        if result.success:
            return Response({'code': result.code, 'message': result.message})
        else:
            return Response({'code': result.code, 'message': result.message}, status=status.HTTP_400_BAD_REQUEST)


class SpaceLeaveUserAPI(APIView):
    def post(self, request, space_id):
        result = spaceservices.leave_user_space(space_id, request.user)
        if result.success:
            return Response({'message': result.message})
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)
