from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import update_assessment_kit_service


class AssessmentKitUpdateApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, assessment_kit_id):
        result = update_assessment_kit_service.assessment_core_dsl_update(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])
