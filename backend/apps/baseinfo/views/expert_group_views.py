from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import expert_group_services


class ExpertGroupApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = expert_group_services.create_expert_group(request)
        return Response(data=result["body"], status=result["status_code"])
