from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_core
from assessment.services import assessment_report_services


class SubjectProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id, subject_id):
        result = assessment_core.get_subject_progress(request,
                                                      assessment_id,
                                                      subject_id)
        return Response(result["body"], result["status_code"])


class AssessmentAttributesReportApi(APIView):
    permission_classes = [IsAuthenticated]

    maturity_level_id_param = openapi.Parameter('maturityLevelId', openapi.IN_QUERY,
                                                description="maturity level id param",
                                                type=openapi.TYPE_INTEGER, required=True)

    @swagger_auto_schema(manual_parameters=[maturity_level_id_param])
    def get(self, request, assessment_id, attribute_id):
        result = assessment_core.get_assessment_attribute_report(request, assessment_id, attribute_id)
        return Response(result["body"], result["status_code"])


class AssessmentAttributesReportExportApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id, attribute_id):
        result = assessment_report_services.get_assessment_attributes_report_export(request,
                                                                                    assessment_id,
                                                                                    attribute_id)
        return Response(result["body"], result["status_code"])


class AssessmentAttributesReportAiApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, assessment_id, attribute_id):
        result = assessment_report_services.get_assessment_attributes_report_ai(request,
                                                                                assessment_id,
                                                                                attribute_id)
        return Response(result["body"], result["status_code"])
