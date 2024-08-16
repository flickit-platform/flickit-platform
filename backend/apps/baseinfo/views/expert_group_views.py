from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser
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
        result = expert_group_services.delete_expert_group(request, expert_group_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, expert_group_id):
        result = expert_group_services.update_expert_group(request, expert_group_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupMembersApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_group_id):
        result = expert_group_services.get_expert_group_members(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupMemberApi(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, expert_group_id, user_id):
        result = expert_group_services.delete_expert_group_member(request, expert_group_id, user_id)
        if result["Success"]:
            return Response(status=result["status_code"])
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


class ExpertGroupAssessmentKitListApi(APIView):
    permission_classes = [IsAuthenticated]
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, expert_group_id):
        result = expert_group_services.get_assessment_kit_list_with_expert_group_id(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupSeenApi(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, expert_group_id):
        result = expert_group_services.expert_group_seen(request, expert_group_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupPictureApi(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    picture_param = openapi.Parameter('pictureFile', openapi.IN_FORM, description="picture file",
                                      type=openapi.TYPE_FILE, required=True)

    @swagger_auto_schema(manual_parameters=[picture_param])
    def put(self, request, expert_group_id):
        result = expert_group_services.update_expert_group_picture(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, expert_group_id):
        result = expert_group_services.delete_expert_group_picture(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])
