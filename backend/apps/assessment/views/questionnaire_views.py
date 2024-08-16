from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.services import question_services, assessment_services
from assessment.services import assessment_permission_services


class LoadQuestionnairesWithAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_services.get_questionnaires_with_assessment_kit(request, assessment_id)
        return Response(data=result["body"], status=result["status_code"])


class LoadQuestionsWithQuestionnairesApi(APIView):
    permission_classes = [IsAuthenticated]
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, assessment_id, questionnaire_id):
        permissions_result = assessment_permission_services.get_assessment_permissions_list(request, assessment_id)
        result = question_services.question_answering_list(request, assessment_id, questionnaire_id)
        if result["status_code"] == 200 and permissions_result["status_code"] == 200:
            result["body"]["permissions"] = permissions_result["body"]["permissions"]
            return Response(data=result["body"], status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
