from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import kit_versions_services


class KitVersionSubjectApi(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request,kit_version_id):
        result = kit_versions_services.create_subject_kit_version(request,kit_version_id)
        return Response(data=result["body"], status=result["status_code"])