from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessment.serializers.user_access_serializers import AssessmentKitAddUserAccess
from baseinfo.permissions import IsOwnerExpertGroup
from baseinfo.services import user_access_services


class AssessmentKitUsersAccessApi(APIView):
    permission_classes = [IsAuthenticated, IsOwnerExpertGroup]

    def get(self, request, assessment_kit_id):
        result = user_access_services.get_assessment_kit_users(assessment_kit_id=assessment_kit_id,
                                                               authorization_header=request.headers['Authorization'],
                                                               query_params=request.query_params
                                                               )
        return Response(data=result["body"], status=result["status_code"])

    @swagger_auto_schema(request_body=AssessmentKitAddUserAccess())
    def post(self, request, assessment_kit_id):
        serializer = AssessmentKitAddUserAccess(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = user_access_services.add_user_in_assessment_kit(assessment_kit_id=assessment_kit_id,
                                                                 authorization_header=request.headers['Authorization'],
                                                                 request_body=serializer.validated_data
                                                                 )
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
