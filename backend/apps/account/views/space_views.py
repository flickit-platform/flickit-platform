from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from account.services import space_services


class AddMemberInSpaceApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, space_id):
        result = space_services.add_member_in_space(request, space_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])