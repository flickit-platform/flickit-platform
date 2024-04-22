from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from baseinfo.services import assessment_kit_service


class AssessmentKitStateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id):
        result = assessment_kit_service.get_assessment_kit_state(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])
