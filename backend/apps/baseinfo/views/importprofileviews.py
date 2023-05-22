from os import access
from django.db.models.fields import return_None
import requests
import traceback

from django.http import FileResponse 
from django.http import HttpResponseForbidden

from django.db.utils import IntegrityError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from assessmentplatform.settings import BASE_DIR, DSL_PARSER_URL_SERVICE

from baseinfo.services import importprofileservice , profileservice
from baseinfo.serializers.profileserializers import ImportProfileSerializer
from baseinfo.permissions import ManageExpertGroupPermission ,ManageProfilePermission


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


class DownloadDslApi(APIView):
    permission_classes = [IsAuthenticated, ManageProfilePermission]
    def get(self,request,profile_id):
        profile = profileservice.load_profile(profile_id)
        result = importprofileservice.get_dsl_file(profile)
        if result.success:
                return FileResponse(result.data["file"] , as_attachment=True,
                        filename=result.data["filename"])
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)


def access_dsl_file(request):
    return HttpResponseForbidden('Not  to access this file.')