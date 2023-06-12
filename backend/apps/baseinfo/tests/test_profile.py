from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate
import pytest
from model_bakery import baker
from baseinfo.views import assessmentkitviews
from baseinfo.models.assessmentkitmodels import ExpertGroup
from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute
from baseinfo.models.metricmodels import Metric, MetricImpact
from assessment.models import AssessmentKit, AssessmentProject
from baseinfo.models.assessmentkitmodels import ExpertGroup ,AssessmentKitLike 
from account.models import User

@pytest.fixture
def init_assessment_kit():
    def do_create_assessment_kit(authenticate, create_expertgroup):
        authenticate()
        test_user = User.objects.get(email = 'test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = 'p1')
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        return assessment_kit
    return do_create_assessment_kit


@pytest.mark.django_db
class Test_Delete_AssessmentKit:
    def test_delete_assessment_kit_when_user_is_memeber_of_assessment_kit_expert_group(self, api_client, init_assessment_kit, authenticate ,create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_assessment_kit_when_user_is_not_memeber_of_assessment_kit_expert_group(self, api_client, init_assessment_kit, authenticate, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        expert_group = create_expertgroup(ExpertGroup, user = baker.make(User, email = 'sajjad@test.com'))
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'


    def test_delete_assessment_kit_when_assessments_exist_with_assessment_kit(self, api_client, init_assessment_kit, authenticate, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        baker.make(AssessmentProject, assessment_kit = assessment_kit)
        
        response = api_client.delete('/baseinfo/assessmentkits/' + str(assessment_kit.id) + "/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == 'Some assessments with this assessment_kit exist'


@pytest.mark.django_db
class TestArchiveAssessmentKits:
    def test_archive_assessment_kits_returns_400(self, create_expertgroup, init_assessment_kit, authenticate):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = False 
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The assessment_kit has already been archived'
        
        
    def test_archive_assessment_kits_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
        
    def test_archive_assessment_kits_returns_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/archive/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitArchiveApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The assessment_kit is archived successfully'


@pytest.mark.django_db
class TestPublishAssessmentKits:
    def test_publish_assessment_kits_returns_400(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The assessment_kit has already been published'
        
    def test_publish_assessment_kits_returns_403(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = False
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request,assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'    
    
    
    def test_publish_assessment_kits_returns_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = False
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/publish/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitPublishApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'The assessment_kit is published successfully'

@pytest.mark.django_db
class TestLikeAssessmentKits:
    def test_like_assessment_kit_return_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email = "test@test.com")
        AssessmentKitLike(assessment_kit = assessment_kit)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/like/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitLikeApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["likes"] == 1
        
@pytest.mark.django_db
class TestAssessmentKitListOptions:
    def test_assessment_kit_list_options_return_200(self, create_expertgroup):
        user1 = baker.make(User, email = "test@test.com")
        assessment_kit1 = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/options/select/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitListOptionsApi.as_view()
        resp = view(request)
        
        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1


@pytest.mark.django_db
class TestAssessmentKitDetailDisplay:
    def test_assessment_kit_detail_display(self, authenticate, init_assessment_kit, init_data, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        init_data()
        user1 = User.objects.get(email = "test@test.com")
        assessment_kit.is_active = True
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/inspectassessmentkit/{assessment_kit.id}/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['title'] == assessment_kit.title
        assert resp.data['summary'] == assessment_kit.summary
        assert resp.data['about'] == assessment_kit.about
        assert resp.data['assessmentKitInfos'][0]['title'] == 'Questionnaires count'
        assert resp.data['assessmentKitInfos'][0]['item'] == 4
        assert resp.data['assessmentKitInfos'][1]['title'] == 'Attributes count'
        assert resp.data['assessmentKitInfos'][1]['item'] == 7
        assert resp.data['assessmentKitInfos'][2]['title'] == 'Total questions count'
        assert resp.data['assessmentKitInfos'][2]['item'] == 11
        assert resp.data['assessmentKitInfos'][3]['title'] == 'Subjects'
        assert len(resp.data['assessmentKitInfos'][3]['item']) == 2
        assert resp.data['assessmentKitInfos'][4]['title'] == 'Tags'
        assert len(resp.data['assessmentKitInfos'][4]['item']) == 0
        

@pytest.mark.django_db
class Test_Analyse_AssessmentKit:
    def test_analyse_assessment_kit(self, api_client, authenticate, init_data):
        authenticate(is_staff=True)
        test_user = User.objects.get(email = 'test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title = "p1")
        expert_group = baker.make(ExpertGroup)
        expert_group.users.add(test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        base_info = init_data()
        response = api_client.get('/baseinfo/analyzeassessmentkit/' + str(assessment_kit.id) + "/")
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
class TestAssessmentKitInitForm:
    def test_get_data_assessment_kit_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN

  
    def test_get_data_assessment_kit_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        data = [
                    {
                        "id": assessment_kit.id,
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
class TestUpdateAssessmentKit:
    def test_update_assessment_kit_return_400(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id+1000],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        api1 = APIRequestFactory()
        request1 = api1.post(f'/baseinfo/assessmentkits/update/{ assessment_kit.id }/', {}, format='json')
        view1 = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, assesssment_kit_id = assessment_kit.id)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] ==  "There is no assessment_kit tag with this id."
        
        assert resp1.status_code == status.HTTP_400_BAD_REQUEST
        assert resp1.data["message"] ==  "All fields cannot be empty."
    
        
    def test_update_assessment_kit_return_403(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        user2 = baker.make(User, email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user2)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN
    
    def test_update_assessment_kit_return_200(self, create_expertgroup, create_tag):
        user1 = baker.make(User, email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code = "tc1" , title = "devops")
        tag2 = create_tag(code = "tc2" , title = "team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.expert_group = expert_group
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data ={
            "tags" : [tag2.id],
            "title" : "test2",
            "summary" : "test2",
            "about":"<p>test2</p>",
            }
        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/update/{assessment_kit.id}', data, format='json')
        force_authenticate(request, user = user1)
        view = assessmentkitviews.UpdateAssessmentKitApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        api1 = APIRequestFactory()
        request1 = api1.get(f'/baseinfo/assessmentkits/get/{ assessment_kit.id }/', {}, format='json')
        view1 = assessmentkitviews.AssessmentKitInitFormApi.as_view()
        force_authenticate(request1, user = user1)
        resp1= view1(request1, assesssment_kit_id = assessment_kit.id)
        
        data =[
                {
                    "id": assessment_kit.id,
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