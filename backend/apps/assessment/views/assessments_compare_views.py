from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import assessments_compare_services


class AssessmentsCompareApi(APIView):
    assessment_id = openapi.Parameter(name='assessment_id', in_=openapi.IN_QUERY, description="test manual param",
                                      type=openapi.TYPE_ARRAY,
                                      items=openapi.Items(type=openapi.TYPE_STRING), collectionFormat="multi")

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(manual_parameters=[assessment_id])
    def post(self, request):
        result = assessments_compare_services.get_assessments_compare_service(request)
        return Response(data=result["body"], status=result["status_code"])
