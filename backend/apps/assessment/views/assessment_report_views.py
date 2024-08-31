from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_report_services, assessment_permission_services


class AssessmentReportApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_report_services.get_assessment_report(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])


class AssessmentSubjectReportApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id, subject_id):
        permissions_result = assessment_permission_services.get_assessment_permissions_list(request, assessment_id)
        result = assessment_report_services.get_assessment_subject_report(request, assessment_id, subject_id)
        if result["status_code"] == 200 and permissions_result["status_code"] == 200:
            result["body"]["permissions"] = permissions_result["body"]["permissions"]
            return Response(data=result["body"], status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class AssessmentProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_report_services.get_assessment_progress(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])
