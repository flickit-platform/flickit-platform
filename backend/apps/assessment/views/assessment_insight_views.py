from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from assessment.services import assessment_insight_services


class AssessmentInsightApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def post(self, request, assessment_id):
        result = assessment_insight_services.create_assessment_insights(request, assessment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def get(self, request, assessment_id):
        result = assessment_insight_services.get_assessment_insights(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])


class AssessmentSubjectInsightApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, assessment_id, subject_id):
        result = assessment_insight_services.create_assessment_subject_insights(request, assessment_id, subject_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def get(self, request, assessment_id, subject_id):
        result = assessment_insight_services.get_assessment_subject_insights(request, assessment_id, subject_id)
        return Response(data=result["body"], status=result["status_code"])
