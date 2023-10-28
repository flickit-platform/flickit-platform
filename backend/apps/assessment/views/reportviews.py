from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_core, assessment_core_services


class AssessmentProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_assessment_progress(assessments_details["body"])
        return Response(result["body"], result["status_code"])


class AssessmentSubjectReportApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id, subject_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_subject_report(assessments_details["body"], subject_id)
        return Response(result["body"], result["status_code"])


class SubjectProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id, subject_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_subject_progress(assessments_details["body"], subject_id)
        return Response(result["body"], result["status_code"])


class AssessmentReportApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_assessment_report(assessments_details["body"])
        return Response(result["body"], result["status_code"])
