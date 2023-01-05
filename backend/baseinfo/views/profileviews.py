import requests
import traceback
from zipfile import ZipFile
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from ..services import profileservice
from ..services import importprofileservice
from ..serializers.profileserializers import ProfileDslSerializer, AssessmentProfileSerilizer, ProfileTagSerializer
from ..models.profilemodels import ProfileDsl, ProfileTag, AssessmentProfile
from ..models.basemodels import MetricCategory

DSL_PARSER_URL_SERVICE = "http://localhost:8080/extract/"

class AssessmentProfileViewSet(ModelViewSet):
    serializer_class = AssessmentProfileSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    filterset_fields = ['metric_categories']
    search_fields = ['title']

    def get_queryset(self):
        queryset = AssessmentProfile.objects.all()
        metric_categories = self.request.query_params.get('metric_categories')
        if metric_categories is not None:
            queryset = queryset.filter(metric_categories=metric_categories)
        return queryset

    def destroy(self, request, *args, **kwargs):
        if MetricCategory.objects.filter(assessment_profile_id=kwargs['pk']).count() > 0:
            return Response({'error' : 'AssessmentProfile cannot be deleted'})
        return super().destroy(request, *args, ** kwargs)

class ProfileTagViewSet(ModelViewSet):
    serializer_class = ProfileTagSerializer
    def get_queryset(self):
        return ProfileTag.objects.all()

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

    def get_queryset(self):
        return ProfileDsl.objects.all()

class ImportProfileApi(APIView):
    def post(self, request):
        dsl_id = request.data.get('dsl_id')
        dsl = ProfileDsl.objects.get(id = dsl_id)
        input_zip = ZipFile(dsl.dsl_file)
        dsl_contents = importprofileservice.extract_dsl_contents(input_zip)
        base_infos_resp = requests.post(DSL_PARSER_URL_SERVICE, json={"dslContent": dsl_contents}).json()
        if base_infos_resp['hasError']:
            return Response({"message": "The uploaded dsl is invalid."}, status = status.HTTP_400_BAD_REQUEST)
        try:
            extra_info = {}
            extra_info['tag_ids'] = request.data.get('tag_ids')
            extra_info['expert_group_id'] = request.data.get('expert_group_id')
            assessment_profile = importprofileservice.import_profile(base_infos_resp, extra_info)
            return Response({"message": "The profile imported successfully", "profile_id": assessment_profile.id}, status = status.HTTP_200_OK)
        except Exception as e:
            message = traceback.format_exc()
            print(message)
            return Response({"message": "Error in importing profile"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)