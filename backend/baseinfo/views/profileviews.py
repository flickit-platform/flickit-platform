import requests
import traceback
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from ..services import profileservice, importprofileservice, expertgroupservice
from ..serializers.profileserializers import ProfileDslSerializer, AssessmentProfileSerilizer, ProfileTagSerializer, ImportProfileSerializer
from ..models.profilemodels import ProfileDsl, ProfileTag, AssessmentProfile, ProfileLike

DSL_PARSER_URL_SERVICE = "http://dsl:8080/extract/"

class AssessmentProfileViewSet(ModelViewSet):
    serializer_class = AssessmentProfileSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    search_fields = ['title']

    def get_queryset(self):
        return AssessmentProfile.objects.filter(is_active=True)

    def destroy(self, request, *args, **kwargs):
        resp = profileservice.delete_validation(kwargs['pk'], request.user.id)
        if resp['is_deletable'] == True:
            return super().destroy(request, *args, ** kwargs)
        else:
            return Response({'message': resp['message']}, status=resp['status'])

class ProfileArchiveApi(APIView):
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        resp = profileservice.delete_validation(profile_id, request.user.id)
        if resp['is_deletable'] == True:
            profile.is_active = False
            profile.save()
            return Response({'message': 'The profile is archived successfully'})
        else:
            return Response({'message': resp['message']}, status=resp['status'])

class ProfilePublishApi(APIView):
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        resp = profileservice.delete_validation(profile_id, request.user.id)
        if resp['is_deletable'] == True:
            profile.is_active = True
            profile.save()
            return Response({'message': 'The profile is published successfully'})
        else:
            return Response({'message': resp['message']}, status=resp['status'])
    
class ProfileTagViewSet(ModelViewSet):
    serializer_class = ProfileTagSerializer
    def get_queryset(self):
        return ProfileTag.objects.all()

class ProfileDetailDisplayApi(APIView):
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        response = profileservice.extract_detail_of_profile(profile, request)
        return Response(response, status = status.HTTP_200_OK)

class ProfileListApi(APIView):
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        response = AssessmentProfileSerilizer(expert_group.profiles, many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK)

class ProfileListOptionsApi(APIView):
    def get(self, request):
        profile_options =  AssessmentProfile.objects.values('id', 'title')
        return Response({'results': profile_options})
    
class UploadProfileApi(ModelViewSet):
    serializer_class = ProfileDslSerializer

    def get_queryset(self):
        return ProfileDsl.objects.all()

class ImportProfileApi(APIView):
    serializer_class = ImportProfileSerializer
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
        except Exception as e:
            message = traceback.format_exc()
            print(message)
            return Response({"message": "Error in importing profile"}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileLikeApi(APIView):
    @transaction.atomic
    def post(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        profile_like_user = ProfileLike.objects.filter(user_id = request.user.id, profile_id = profile.id)
        if profile_like_user.count() == 1:
            profile.likes.filter(user_id = request.user, profile_id = profile.id).delete()
            profile.save()
        elif profile_like_user.count() == 0:
            profile_like_create = ProfileLike.objects.create(user_id = request.user.id, profile_id = profile.id)
            profile.likes.add(profile_like_create)
            profile.save()
        return Response({'likes': profile.likes.count()})
