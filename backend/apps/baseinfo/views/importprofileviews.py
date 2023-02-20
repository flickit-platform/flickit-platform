import requests
import traceback
from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import importprofileservice
from baseinfo.serializers.profileserializers import ImportProfileSerializer
from baseinfo.permissions import ManageExpertGroupPermission


DSL_PARSER_URL_SERVICE = "http://localhost:8080/extract/"

class ImportProfileApi(APIView):
    serializer_class = ImportProfileSerializer
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def post(self, request):
        serializer = ImportProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dsl_contents = importprofileservice.extract_dsl_contents(serializer.validated_data['dsl_id'])
        base_infos_resp = requests.post(DSL_PARSER_URL_SERVICE, json={"dslContent": dsl_contents}).json()
        if base_infos_resp['hasError']:
            return Response({"message": "The uploaded dsl is invalid."}, status = status.HTTP_400_BAD_REQUEST)
        try:
            assessment_profile = importprofileservice.import_profile(base_infos_resp, **serializer.validated_data)
            return Response({"message": "The profile imported successfully", "id": assessment_profile.id}, status = status.HTTP_200_OK)
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
