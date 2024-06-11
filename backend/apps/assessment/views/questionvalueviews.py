from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from assessment.serializers import questionvalueserializers
from assessment.services import assessment_core, assessment_core_services


class AnswerQuestionApi(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = questionvalueserializers.AnswerQuestionSerializer

    @swagger_auto_schema(request_body=serializer_class, responses={201: ""})
    def put(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        serializer_data = self.serializer_class(data=request.data)
        serializer_data.is_valid(raise_exception=True)
        result = assessment_core.question_answering(assessments_details=assessments_details["body"],
                                                    serializer_data=serializer_data.validated_data,
                                                    authorization_header=request.headers['Authorization'],
                                                    )
        return Response(result["body"], result["status_code"])
