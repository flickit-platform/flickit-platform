from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services.confidence_levels_services import get_confidence_levels_in_assessment_core


class ConfidenceLevelsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = get_confidence_levels_in_assessment_core()
        return Response(data=result["body"], status=result["status_code"])
