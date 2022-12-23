import requests
from zipfile import ZipFile
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response

from ..services import profileservice
from ..services import importprofileservice
from ..serializers.profileserializers import ProfileDslSerializer
from ..serializers.commonserializers import FileUploadSerializer
from ..models import ProfileDsl
import traceback

class ProfileDetailDisplayApi(APIView):
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        if profile is None:
            error_message = "No profile is Found with the given profile_id {}".format(profile_id)
            return Response({"message": error_message}, status = status.HTTP_400_BAD_REQUEST)
        response = profileservice.extract_detail_of_profile(profile)
        return Response(response, status = status.HTTP_200_OK)
    
class UploadProfileApi(ModelViewSet):
    serializer_class = ProfileDslSerializer
    def get_serializer_context(self):
        return {'profile_id': self.kwargs['profile_pk']}

    def get_queryset(self):
        return ProfileDsl.objects.filter(profile_id=self.kwargs['profile_pk'])

class ImportProfileApi(CreateAPIView):
    serializer_class = FileUploadSerializer
    def post(self, request):
        file = self.extract_file(request)
        dsl_contents = importprofileservice.extract_dsl_contents(file)
        resp = requests.post("http://localhost:8080/extract/", json={"dslContent": dsl_contents}).json()
        if resp['hasError']:
            return Response({"message": "The uploaded dsl is invalid."}, status = status.HTTP_400_BAD_REQUEST)
        try:
            importprofileservice.import_profile(resp)
            return Response({"message": "The profile imported successfully", "resp": resp}, status = status.HTTP_200_OK)
        except Exception as e:
            message = traceback.format_exc()
            print(message)
            return Response({"message": "Error in importing profile"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

    def extract_file(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file = serializer.validated_data['file']
        input_zip = ZipFile(file)
        return input_zip


    

