from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_user_roles_services


class AssessmentUserRolesListApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = assessment_user_roles_services.assessment_user_roles_list(request)
        return Response(data=result["body"], status=result["status_code"])


class UserRolesInAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, assessment_id, user_id):
        result = assessment_user_roles_services.update_user_role_in_assessment(request, assessment_id, user_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, assessment_id, user_id):
        result = assessment_user_roles_services.delete_user_role_in_assessment(request, assessment_id, user_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class UsersRolesInAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, assessment_id):
        result = assessment_user_roles_services.add_user_role_in_assessment(request, assessment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
