from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from assessment.services import assessment_services


class AssessmentProjectApi(APIView):
    permission_classes = [IsAuthenticated]

    space_id_param = openapi.Parameter('spaceId', openapi.IN_QUERY, description="space id param",
                                       type=openapi.TYPE_INTEGER)
    kit_id_param = openapi.Parameter('kitId', openapi.IN_QUERY, description="kit id param",
                                     type=openapi.TYPE_INTEGER)
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[space_id_param, kit_id_param, size_param, page_param])
    def get(self, request):
        result = assessment_services.list_assessments(request)
        return Response(result["body"], result["status_code"])


class AssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_services.load_assessment(request, assessment_id)
        return Response(result["body"], result["status_code"])

    def delete(self, request, assessment_id):
        result = assessment_services.assessment_delete(request, assessment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
