from os import access
from django.db.models.fields import return_None
import requests
import traceback

from django.http import FileResponse
from django.http import HttpResponseForbidden

from django.db.utils import IntegrityError
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessmentplatform.settings import BASE_DIR, DSL_PARSER_URL_SERVICE

from baseinfo.services import importassessmentkitservice, assessmentkitservice, dsl_services
from baseinfo.serializers.assessmentkitserializers import ImportAssessmentKitSerializer, DslSerializer
from baseinfo.permissions import IsMemberExpertGroup, IsOwnerExpertGroup


class ImportAssessmentKitApi(APIView):
    serializer_class = ImportAssessmentKitSerializer
    permission_classes = [IsAuthenticated, IsOwnerExpertGroup]

    def post(self, request):
        serializer = ImportAssessmentKitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dsl_contents = importassessmentkitservice.extract_dsl_contents(serializer.validated_data['dsl_id'])
        response = requests.post(DSL_PARSER_URL_SERVICE, json={"dslContent": dsl_contents})
        base_info_resp = response.json()
        if response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
            return Response(data=base_info_resp, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if base_info_resp['hasError']:
            return Response({"message": "The uploaded dsl is invalid."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            assessment_kit = importassessmentkitservice.import_assessment_kit(base_info_resp,
                                                                              **serializer.validated_data)
            return Response({"message": "The assessment_kit imported successfully", "id": assessment_kit.id},
                            status=status.HTTP_200_OK)
        except IntegrityError as e:
            message = traceback.format_exc()
            print(message)
            return self.handle_integrity_error(e)

    def handle_integrity_error(self, integrity_error):
        error_message = str(integrity_error)
        if 'duplicate key value violates unique constraint' in error_message:
            column_name = error_message.split("(")[1].split(")")[0]
            column_value = error_message.split("(")[2].split(")")[0]
            model_name = error_message.split(".")[0].split("_")[1]
            refined_message = f"A value '{column_value}' for the '{column_name}' field in '{model_name}' model already exists."
            return Response({'message': refined_message}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadDslApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    def get(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        result = importassessmentkitservice.get_dsl_file(assessment_kit)
        if result.success:
            return FileResponse(result.data["file"], as_attachment=True,
                                filename=result.data["filename"])
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)


def access_dsl_file(request):
    return HttpResponseForbidden('Not  to access this file.')


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
