from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate
import pytest
from model_bakery import baker
from baseinfo.views import profileviews
from baseinfo.models.profilemodels import ExpertGroup
from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute
from baseinfo.models.metricmodels import Metric, MetricImpact
from assessment.models import AssessmentProfile, AssessmentProject
from baseinfo.models.profilemodels import ExpertGroup ,ProfileLike 
from account.models import User

@pytest.fixture
def init_profile():
    def do_create_profile(authenticate, create_expertgroup):
        authenticate()
        test_user = User.objects.get(email = 'test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        profile = baker.make(AssessmentProfile, title = 'p1')
        expert_group = create_expertgroup(ExpertGroup, test_user)
        profile.expert_group = expert_group
        profile.save()
        return profile
    return do_create_profile


@pytest.mark.django_db
class Test_Delete_Profile:
    def test_delete_profile_when_user_is_memeber_of_profile_expert_group(self, api_client, init_profile, authenticate ,create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_profile_when_user_is_not_memeber_of_profile_expert_group(self, api_client, init_profile, authenticate, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        expert_group = create_expertgroup(ExpertGroup, user = baker.make(User, email = 'sajjad@test.com'))
        profile.expert_group = expert_group
        profile.save()
        
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'


    def test_delete_profile_when_assessments_exist_with_profile(self, api_client, init_profile, authenticate, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        baker.make(AssessmentProject, assessment_profile = profile)
        
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == 'Some assessments with this profile exist'


@pytest.mark.django_db
class TestArchiveProfiles:
    def test_archive_profiles_returns_400(self, create_expertgroup, init_profile, authenticate):
        profile = init_profile(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        profile.is_active = False 
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The profile has already been archived'
        
        
    def test_archive_profiles_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = True
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
        
    def test_archive_profiles_returns_200(self, authenticate, init_profile, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        profile.is_active = True
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/archive/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileArchiveApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The profile is archived successfully'


@pytest.mark.django_db
class TestPublishProfiles:
    def test_publish_profiles_returns_400(self, authenticate, init_profile, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        profile.is_active = True
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The profile has already been published'
        
    def test_publish_profiles_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        profile.is_active = False
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request,profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'    
    
    
    def test_publish_profiles_returns_200(self, authenticate, init_profile, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        profile.is_active = False
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/publish/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfilePublishApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The profile is published successfully'

@pytest.mark.django_db
class TestLikeProfiles:
    def test_like_profile_return_200(self, authenticate, init_profile, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        ProfileLike(profile = profile)
        profile.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/like/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileLikeApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["likes"] == 1
        
@pytest.mark.django_db
class TestProfileListOptions:
    def test_profile_list_options_return_200(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        profile1 = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile1.expert_group = expert_group
        profile1.is_active = True
        profile1.save()
        profile2 = baker.make(AssessmentProfile)
        profile2.expert_group = expert_group
        profile2.is_active = False
        profile2.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/profiles/options/select/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileListOptionsApi.as_view()
        resp = view(request)
        
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1


@pytest.mark.django_db
class TestProfileDetailDisplay:
    def test_profile_detail_display(self, authenticate, init_profile, init_data, create_expertgroup):
        profile = init_profile(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        profile.is_active = True
        profile.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectprofile/{profile.id}/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileDetailDisplayApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['title'] == profile.title
        assert resp.data['summary'] == profile.summary
        assert resp.data['about'] == profile.about
        assert resp.data['profileInfos'][0]['title'] == 'Questionnaires count'
        assert resp.data['profileInfos'][0]['item'] == 4
        assert resp.data['profileInfos'][1]['title'] == 'Attributes count'
        assert resp.data['profileInfos'][1]['item'] == 7
        assert resp.data['profileInfos'][2]['title'] == 'Total questions count'
        assert resp.data['profileInfos'][2]['item'] == 11
        assert resp.data['profileInfos'][3]['title'] == 'Subjects'
        assert len(resp.data['profileInfos'][3]['item']) == 2
        assert resp.data['profileInfos'][4]['title'] == 'Tags'
        assert len(resp.data['profileInfos'][4]['item']) == 0
        

@pytest.mark.django_db
class Test_Analyse_Profile:
    def test_analyse_profile(self, api_client, authenticate, init_data):
        authenticate(is_staff=True)
        test_user = User.objects.get(email = 'test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        profile = baker.make(AssessmentProfile, title = "p1")
        expert_group = baker.make(ExpertGroup)
        expert_group.users.add(test_user)
        profile.expert_group = expert_group
        profile.save()
        base_info = init_data()
        response = api_client.get('/baseinfo/analyzeprofile/' + str(profile.id) + "/")
        analyze_list = response.data
        assert analyze_list[0]['level_analysis'][0]['attribute_metric_number'] == 0
        assert analyze_list[0]['level_analysis'][1]['attribute_metric_number'] == 2
        assert analyze_list[0]['level_analysis'][2]['attribute_metric_number'] == 3
        assert analyze_list[0]['level_analysis'][3]['attribute_metric_number'] == 3
        assert analyze_list[0]['level_analysis'][4]['attribute_metric_number'] == 2
        assert analyze_list[0]['level_analysis'][5]['attribute_metric_number'] == 1

        assert analyze_list[1]['level_analysis'][0]['attribute_metric_number'] == 0
        assert analyze_list[1]['level_analysis'][1]['attribute_metric_number'] == 2
        assert analyze_list[1]['level_analysis'][2]['attribute_metric_number'] == 2
        assert analyze_list[1]['level_analysis'][3]['attribute_metric_number'] == 3
        assert analyze_list[1]['level_analysis'][4]['attribute_metric_number'] == 2
        assert analyze_list[1]['level_analysis'][5]['attribute_metric_number'] == 2
        assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
class TestProfileInitForm:
    def test_get_data_profile_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        profile.code = "tu1"
        profile.title = "title user1"
        profile.about = "about user 1"
        profile.summary = "summary user1"
        profile.expert_group = expert_group
        profile.tags.add(tag1)
        profile.tags.add(tag2)
        profile.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/profiles/get/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.ProfileInitFormApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN

  
    def test_get_data_profile_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        profile.code = "tu1"
        profile.title = "title user1"
        profile.about = "about user 1"
        profile.summary = "summary user1"
        profile.expert_group = expert_group
        profile.tags.add(tag1)
        profile.tags.add(tag2)
        profile.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/profiles/get/{ profile.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.ProfileInitFormApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        data = [
                    {
                        "id": profile.id,
                        "title": "title user1",
                        "summary": "summary user1",
                        "about": "about user 1",
                        "tags": [
                           
                            {
                                "id": tag1.id,
                                "code": "tc1",
                                "title": "devops"
                            },
                            {
                                "id": tag2.id,
                                "code": "tc2",
                                "title": "team"
                            }
                        ]
                    }
                ]
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data == data
        


@pytest.mark.django_db
class TestUpdateProfile:
    def test_update_profile_return_400(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        profile.code = "tu1"
        profile.title = "title user1"
        profile.about = "about user 1"
        profile.summary = "summary user1"
        profile.expert_group = expert_group
        profile.tags.add(tag1)
        profile.tags.add(tag2)
        profile.save()

        data ={
            "tags" : [tag2.id+1000],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/update/{profile.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.UpdateProfileApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        api1 = APIRequestFactory()
        request1 = api1.post(f'/baseinfo/profiles/update/{ profile.id }/', {}, format='json')
        view1 = profileviews.UpdateProfileApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, profile_id = profile.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] ==  "There is no profile tag with this id."
        
        assert resp1.status_code == status.HTTP_400_BAD_REQUEST
        assert resp1.data["message"] ==  "All fields cannot be empty."
    
        
    def test_update_profile_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        profile.code = "tu1"
        profile.title = "title user1"
        profile.about = "about user 1"
        profile.summary = "summary user1"
        profile.expert_group = expert_group
        profile.tags.add(tag1)
        profile.tags.add(tag2)
        profile.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/update/{profile.id}', data, format='json')
        force_authenticate(request, user = user2)
        view = profileviews.UpdateProfileApi.as_view()
        resp = view(request, profile_id = profile.id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN
    
    def test_update_profile_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        profile = baker.make(AssessmentProfile)
        expert_group = create_expertgroup(ExpertGroup, user1)
        profile.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        profile.code = "tu1"
        profile.title = "title user1"
        profile.about = "about user 1"
        profile.summary = "summary user1"
        profile.expert_group = expert_group
        profile.tags.add(tag1)
        profile.tags.add(tag2)
        profile.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/profiles/update/{profile.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = profileviews.UpdateProfileApi.as_view()
        resp = view(request, profile_id = profile.id)
        
        api1 = APIRequestFactory()
        request1 = api1.get(f'/baseinfo/profiles/get/{ profile.id }/', {}, format='json')
        view1 = profileviews.ProfileInitFormApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, profile_id = profile.id)
        
        data =[
                {
                    "id": profile.id,
                    "title": "test2",
                    "summary": "test2",
                    "about": "<p>test2</p>",
                    "tags": [
                        {
                            "id": tag2.id,
                            "code": "tc2",
                            "title": "team"
                        }
                    ]
                }
            ]
        assert resp.status_code == status.HTTP_200_OK
        assert resp1.data == data