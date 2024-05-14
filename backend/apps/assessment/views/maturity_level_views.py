from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessment.services import maturity_level_services


class MaturityLevelCalculateApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        result = maturity_level_services.calculate_maturity_level(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])
