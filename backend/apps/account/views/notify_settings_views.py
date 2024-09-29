from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from account.services import notify_settings_services

class NotificationSettingsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        result = notify_settings_services.get_notify_settings(request)
        return Response(data=result["body"], status=result["status_code"])

