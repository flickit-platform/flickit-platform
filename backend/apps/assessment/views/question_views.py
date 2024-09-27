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


class AnswerHistoryApi(APIView):
    permission_classes = [IsAuthenticated]
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, assessment_id, question_id):
        result = question_services.answer_history_list(request, assessment_id, question_id)
        return Response(result["body"], result["status_code"])
