from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_services


class LoadQuestionnairesWithAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_services.get_questionnaires_with_assessment_kit(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])

