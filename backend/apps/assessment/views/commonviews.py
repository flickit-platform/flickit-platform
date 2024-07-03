from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from assessment.services import assessment_core_services, assessment_core
from rest_framework.permissions import IsAuthenticated


class PathInfoApi(APIView):
    permission_classes = [IsAuthenticated]
    assessment_id_param = openapi.Parameter('assessment_id', openapi.IN_QUERY, description="assessment id param",
                                            type=openapi.TYPE_STRING)
    space_id_param = openapi.Parameter('space_id', openapi.IN_QUERY, description="space id param",
                                       type=openapi.TYPE_INTEGER)
    questionnaire_id_param = openapi.Parameter('questionnaire_id', openapi.IN_QUERY,
                                               description="questionnaire id param",
                                               type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[assessment_id_param, space_id_param, questionnaire_id_param])
    def get(self, request):
        if "assessment_id" in request.query_params:
            assessment_id = request.query_params["assessment_id"]
            assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
            if not assessments_details["Success"]:
                return Response(assessments_details["body"], assessments_details["status_code"])
            result = assessment_core.get_path_info_with_assessment_id(request, assessments_details["body"])
        elif "space_id" in request.query_params:
            space_id = request.query_params["space_id"]
            result = assessment_core.get_path_info_with_space_id(space_id)
        else:
            return Response({"code": "INVALID_INPUT", "message": "'assessment_id' or 'space_id' may not be empty"},
                            status.HTTP_400_BAD_REQUEST)
        return Response(result["body"], result["status_code"])
