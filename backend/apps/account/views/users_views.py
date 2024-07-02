from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from account.services import users_services


class UserInfoApi(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        result = users_services.user_info(request)
        return Response(data=result["body"], status=result["status_code"])
