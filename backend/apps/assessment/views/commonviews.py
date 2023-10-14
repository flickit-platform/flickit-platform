from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from assessment.models import AssessmentResult
from assessment.services import commonservices, assessment_core_services, assessment_core
from assessment.serializers.commonserializers import AssessmentResultSerilizer
from rest_framework.permissions import IsAuthenticated



class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer


class ColorApi(APIView):
    def get(self, request):
        colors = commonservices.load_color()
        return Response(colors, status=status.HTTP_200_OK)


class BreadcrumbInformationView(APIView):
    def post(self, request):
        content = commonservices.loadBreadcrumbInfo(request.data)
        return Response(content)


class PathInfoApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if "assessment_id" not in request.query_params:
            return Response({"code": "INVALID_INPUT", "message": "'assessment_id' may not be empty"},
                            status.HTTP_400_BAD_REQUEST)
        assessment_id = request.query_params["assessment_id"]
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_path_info(assessments_details["body"])
        return Response(result["body"], result["status_code"])
