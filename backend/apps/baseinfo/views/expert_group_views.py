from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessment.serializers.user_access_serializers import InviteUserWithEmailSerializer
from baseinfo.services import expert_group_services


class ExpertGroupsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = expert_group_services.get_expert_group_list(request)
        return Response(data=result["body"], status=result["status_code"])

    def post(self, request):
        result = expert_group_services.create_expert_group(request)
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_group_id):
        result = expert_group_services.get_expert_group_details(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, expert_group_id):
        result = expert_group_services.delete_expert_group_members()
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupMembersApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_group_id):
        result = expert_group_services.get_expert_group_members(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupInviteMembersApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=InviteUserWithEmailSerializer())
    def post(self, request, expert_group_id):
        serializer = InviteUserWithEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = expert_group_services.add_expert_group_members(request, expert_group_id, serializer.validated_data)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupInviteMembersConfirmApi(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, expert_group_id, invite_token):
        result = expert_group_services.confirm_expert_group_members(request, expert_group_id, invite_token)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
