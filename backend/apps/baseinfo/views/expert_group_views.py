from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import expert_group_services


class ExpertGroupsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = expert_group_services.get_expert_group_list(request)
        return Response(data=result["body"], status=result["status_code"])

    def post(self, request):
        result = expert_group_services.create_expert_group(request)
        return Response(data=result["body"], status=result["status_code"])


class ExpertGroupApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_group_id):
        result = expert_group_services.get_expert_group_details(request, expert_group_id)
        return Response(data=result["body"], status=result["status_code"])