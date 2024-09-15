from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from assessment.services import assessment_analysis_services


class UploadAnalysisFileApi(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        operation_description="Upload a file for analysis related to a specific assessment.",
        manual_parameters=[
            openapi.Parameter(
                'inputFile',
                in_=openapi.IN_FORM,
                description='The file to be uploaded for analysis.',
                type=openapi.TYPE_FILE,
                required=True
            ),
            openapi.Parameter(
                'analysisType',
                in_=openapi.IN_FORM,
                description='Type of analysis to be performed on the uploaded file.',
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            201: openapi.Response(
                description="File uploaded successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'fileLink': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Link to the uploaded file.'
                        )
                    }
                )
            ),
            400: openapi.Response(description="Bad Request - Missing or invalid input."),
            500: openapi.Response(description="Internal Server Error - An error occurred during the upload process."),
        }
    )
    def post(self, request, assessment_id):
        result = assessment_analysis_services.upload_analysis_file(request=request,
                                                                   assessment_id=assessment_id)
        return Response(data=result["body"], status=result["status_code"])
