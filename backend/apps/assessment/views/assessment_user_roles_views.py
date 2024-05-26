from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessment_user_roles_services


class AssessmentUserRolesApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = assessment_user_roles_services.assessment_user_roles_list(request)
        return Response(data=result["body"], status=result["status_code"])
