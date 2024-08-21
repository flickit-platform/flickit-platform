from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.http import FileResponse
from baseinfo.services.dsl_conversion_service import DSLConverterService
from baseinfo.serializers.dsl_serializers import ExcelFileUploadSerializer
from io import BytesIO
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class DSLConversionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        operation_description="Convert Excel file to DSL and return as a zipped file",
        request_body=ExcelFileUploadSerializer,
        responses={
            200: openapi.Response(
                description="A zip file containing the DSL files",
                content_type='application/zip',
                schema=openapi.Schema(type=openapi.TYPE_FILE)
            ),
            400: "Bad Request",
            500: "Internal Server Error",
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = ExcelFileUploadSerializer(data=request.data)

        if serializer.is_valid():
            file = serializer.validated_data['file']
            try:
                # Create an instance of the conversion service
                converter_service = DSLConverterService(file)
                # Convert the Excel file to DSL and get the zip file as bytes
                zip_file_content = converter_service.convert_excel_to_dsl()

                # Create an in-memory file response
                response = FileResponse(BytesIO(zip_file_content), content_type='application/zip')
                response['Content-Disposition'] = 'attachment; filename=kits_assessment.zip'
                return response

            except ValueError as ve:
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": f"An unexpected error occurred: {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)