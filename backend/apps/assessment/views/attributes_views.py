from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import attributes_services

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class EvidencesOfAttributeApi(APIView):
    type_param = openapi.Parameter('type', openapi.IN_QUERY, description="type param",
                                   type=openapi.TYPE_STRING, required=True)
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[type_param, size_param, page_param])
    def get(self, request, assessment_id, attribute_id):
        result = attributes_services.get_evidences_with_attribute(request, assessment_id, attribute_id)
        return Response(data=result["body"], status=result["status_code"])
