from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate
import pytest
from model_bakery import baker
from baseinfo.views import profileviews, importprofileviews , expertgroupviews

from assessment.models import AssessmentProfile, AssessmentProject
from baseinfo.models.profilemodels import ExpertGroup ,ProfileLike 
from account.models import User


@pytest.mark.django_db
class Test_Delete_Profile:
    def test_delete_profile_when_user_is_memeber_of_profile_expert_group(self, create_user, create_profile ,create_expertgroup):
        #init data
        user1 = create_user(email = 'test@test.com')
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup,user1)
        profile.expert_group = expert_group
        profile.save()
        
        #create request and send request
        api = APIRequestFactory()
        request = api.delete(f'/baseinfo/profiles/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.AssessmentProfileViewSet.as_view({ "delete" : "destroy" })
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN


    def test_delete_profile_when_user_is_not_memeber_of_profile_expert_group(self, create_user, create_profile, create_expertgroup):
        #init_data
        user1 = create_user(email = 'sajjad@test.com')
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.save()
        
        #create request and send request
        api = APIRequestFactory()
        request = api.delete(f'/baseinfo/profiles/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.AssessmentProfileViewSet.as_view({ "delete" : "destroy" })
        resp = view(request)

        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'


    def test_delete_profile_when_assessments_exist_with_profile(self, create_user, create_profile):
        #init data
        user1 = create_user(email = 'test@test.com')
        profile = create_profile(AssessmentProfile)
        expert_group = baker.make(ExpertGroup)
        baker.make(AssessmentProject, assessment_profile = profile)
        expert_group.users.add(user1)
        profile.expert_group = expert_group
        profile.save()
        
        #create request and send request
        api = APIRequestFactory()
        request = api.delete(f'/baseinfo/profiles/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.AssessmentProfileViewSet.as_view({ "delete" : "destroy" })
        resp = view(request)

        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'


@pytest.mark.django_db
class TestArchiveProfiles:
    def test_archive_profiles_returns_401(self):
        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/1/', {}, format='json')
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_archive_profiles_returns_400(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = False 
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The profile has already been archived'
        
        
    def test_archive_profiles_returns_403(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = True
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
        
    def test_archive_profiles_returns_200(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = True
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The profile is archived successfully'


@pytest.mark.django_db
class TestPublishProfiles:
    def test_publish_profiles_returns_401(self,):
                #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/1/', {}, format='json')
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_publish_profiles_returns_400(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = True
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The profile has already been published'
        
    def test_publish_profiles_returns_403(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = False
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'    
    
    
    def test_publish_profiles_returns_200(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = False
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The profile is published successfully'

@pytest.mark.django_db
class TestLikeProfiles:
    def test_like_profile_return_401(self):
        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/like/1/', {}, format='json')
        force_authenticate(request)
        view = profileviews.ProfileLikeApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_like_profile_return_400(self, create_user, create_expertgroup, create_profile ):
        #init data
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        ProfileLike(profile = profile)
        profile.is_active = False
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/like/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfileLikeApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "The submitted request is invalid."
        
        
    def test_like_profile_return_200(self, create_user, create_expertgroup, create_profile ):
        #init data
        user1 = create_user(email = "test@test.com")
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        ProfileLike(profile = profile)
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/like/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileLikeApi.as_view()
        resp = view(request,profile.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["likes"] == 1
        
@pytest.mark.django_db
class TestProfileListOptions:
    def test_profile_list_options_return_401(self):
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/profiles/options/select/', {}, format='json')
        view = profileviews.ProfileListOptionsApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_profile_list_options_return_200(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        profile1 = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile1.expert_group = expert_group
        profile1.is_active = True
        profile1.save()
        profile2 = create_profile(AssessmentProfile)
        profile2.expert_group = expert_group
        profile2.is_active = False
        profile2.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/profiles/options/select/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileListOptionsApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1


@pytest.mark.django_db
class TestProfileDetailDisplay:
    def test_profile_detail_display_return_401(self):
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectprofile/1/', {}, format='json')
        view = profileviews.ProfileListOptionsApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_profile_detail_display_return_200(self, create_user, create_expertgroup, create_profile):
        #init data
        user1 = create_user(email = "test@test.com")
        profile = create_profile(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = True
        profile.save()

        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectprofile/{profile.id}/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileListOptionsApi.as_view()
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1
