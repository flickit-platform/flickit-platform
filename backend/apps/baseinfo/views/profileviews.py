from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated

from baseinfo.decorators import is_expert
from baseinfo.services import profileservice, expertgroupservice
from baseinfo.serializers.profileserializers import ProfileDslSerializer, AssessmentProfileSerilizer, ProfileTagSerializer
from baseinfo.models.profilemodels import ProfileDsl, ProfileTag, AssessmentProfile
from baseinfo.permissions import ManageExpertGroupPermission

class AssessmentProfileViewSet(ModelViewSet):
    serializer_class = AssessmentProfileSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    search_fields = ['title']

    def get_queryset(self):
        if self.action == 'list':
            return AssessmentProfile.objects.filter(is_active = True)
        return AssessmentProfile.objects.all()
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        result = profileservice.is_profile_deletable(kwargs['pk'], request.user.id)
        if result:
            return super().destroy(request, *args, ** kwargs)
        else:
            return Response({'message': 'Some assessments with this profile exist'}, status=status.HTTP_400_BAD_REQUEST)
        

class ProfileDetailDisplayApi(APIView):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def get(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        response = profileservice.extract_detail_of_profile(profile, request)
        return Response(response, status = status.HTTP_200_OK)

class ProfileAnalyzeApi(APIView):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def get(self, request, profile_id):
        result = profileservice.analyze(profile_id)
        return Response(result.data, status = status.HTTP_200_OK)

class ProfileListApi(APIView):
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        response = AssessmentProfileSerilizer(expert_group.profiles.filter(is_active=True), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)
    
class UnpublishedProfileListApi(APIView):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        response = AssessmentProfileSerilizer(expert_group.profiles.filter(is_active=False), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)

class ProfileListOptionsApi(APIView):
    def get(self, request):
        profile_options =  AssessmentProfile.objects.filter(is_active = True).values('id', 'title')
        return Response({'results': profile_options})

class ProfileArchiveApi(APIView):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def post(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        result = profileservice.archive_profile(profile ,request.user.id)
        if not result:
            return Response({'message': 'The profile has already been archived'}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': 'The profile is archived successfully'})

class ProfilePublishApi(APIView):
    permission_classes = [IsAuthenticated, ManageExpertGroupPermission]
    def post(self, request, profile_id):
        profile = profileservice.load_profile(profile_id)
        result = profileservice.publish_profile(profile, request.user.id)
        if not result:
            return Response({'message': 'The profile has already been published'}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': 'The profile is published successfully'})

class ProfileTagViewSet(ModelViewSet):
    serializer_class = ProfileTagSerializer
    def get_queryset(self):
        return ProfileTag.objects.all()
    
class UploadProfileApi(ModelViewSet):
    serializer_class = ProfileDslSerializer

    def get_queryset(self):
        return ProfileDsl.objects.all()

class ProfileLikeApi(APIView):
    @transaction.atomic
    def post(self, request, profile_id):
        result = profileservice.like_profile(request.user.id, profile_id)
        if result == False:
            return Response({'message': 'The submitted request is invalid.'}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'likes': result.likes.count()})

