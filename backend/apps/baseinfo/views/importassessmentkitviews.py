from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import dsl_services, assessment_kit
from baseinfo.serializers.assessmentkitserializers import DslSerializer


class ImportDslFileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DslSerializer

    @swagger_auto_schema(responses={201: serializer_class()})
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = dsl_services.upload_dsl_assessment(data=serializer.validated_data,
                                                    request=request)
        return Response(data=result["body"], status=result["status_code"])


class CreateAssessmentKitByDsl(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        result = assessment_kit.create_assessment_by_dsl(data=request.data,
                                                         request=request)
        return Response(data=result["body"], status=result["status_code"])
