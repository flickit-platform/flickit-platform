from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from assessment.services import question_services


class AnswerQuestionApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def put(self, request, assessment_id):
        result = question_services.question_answering(request, assessment_id)
        return Response(result["body"], result["status_code"])
