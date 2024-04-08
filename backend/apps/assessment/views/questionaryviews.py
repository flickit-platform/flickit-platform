from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from assessment.services import assessment_core, assessment_core_services


class LoadQuestionnairesWithAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_questionnaires_in_assessment(assessments_details["body"])
        return Response(result["body"], result["status_code"])
