from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessment.services import assessment_core_services ,advice_services


class AdviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = advice_services.get_advice(request, assessment_id)
        return Response(result["body"], result["status_code"])


