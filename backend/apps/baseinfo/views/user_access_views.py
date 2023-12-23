from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.permissions import IsOwnerExpertGroup
from baseinfo.services import user_access_services


class AssessmentKitUsersListApi(APIView):
    permission_classes = [IsAuthenticated, IsOwnerExpertGroup]

    def get(self, request, assessment_kit_id):
        result = user_access_services.get_assessment_kit_users(assessment_kit_id=assessment_kit_id,
                                                               authorization_header=request.headers['Authorization'],
                                                               query_params=request.query_params
                                                               )
        return Response(data=result["body"], status=result["status_code"])
