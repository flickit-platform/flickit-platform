from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessment.services import advice_services


class AdviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        result = advice_services.get_advice(request, assessment_id)
        return Response(result["body"], result["status_code"])


