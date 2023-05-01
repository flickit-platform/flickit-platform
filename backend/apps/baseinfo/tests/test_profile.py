from rest_framework import status
import pytest
from model_bakery import baker
from unittest import skip

from assessment.models import AssessmentProfile, AssessmentProject
from baseinfo.models.profilemodels import ExpertGroup
from baseinfo.models.basemodels import AssessmentSubject
from account.models import User
from django.contrib.auth.models import Permission



@pytest.mark.django_db
class Test_Delete_Profile:
    def test_delete_profile_when_user_is_memeber_of_profile_expert_group(self, api_client, authenticate):
        authenticate(is_staff=True)
        test_user = User.objects.get(email = 'test@test.com')
        profile = baker.make(AssessmentProfile)
        expert_group = baker.make(ExpertGroup)
        expert_group.users.add(test_user)
        profile.expert_group = expert_group
        profile.save()
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_profile_when_user_is_not_memeber_of_profile_expert_group(self, api_client, authenticate):
        authenticate(is_staff=True)
        saj_user = baker.make(User, email = 'sajjad@test.com')
        profile = baker.make(AssessmentProfile)
        expert_group = baker.make(ExpertGroup)
        expert_group.users.add(saj_user)
        profile.expert_group = expert_group
        profile.save()
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'


    def test_delete_profile_when_assessments_exist_with_profile(self, api_client, authenticate):
        authenticate(is_staff=True)
        test_user = User.objects.get(email = 'test@test.com')
        profile = baker.make(AssessmentProfile)
        expert_group = baker.make(ExpertGroup)
        baker.make(AssessmentProject, assessment_profile = profile)
        expert_group.users.add(test_user)
        profile.expert_group = expert_group
        profile.save()
        response = api_client.delete('/baseinfo/profiles/' + str(profile.id) + "/")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['message'] == 'You do not have permission to perform this action.'


@pytest.mark.django_db
class Test_Analyse_Profile:
    @skip("Skip test")
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
        assert analyze_list[0]['metrics_number_by_level'][0]['metric_number'] == 2
        assert analyze_list[0]['metrics_number_by_level'][1]['metric_number'] == 4
        assert analyze_list[0]['metrics_number_by_level'][2]['metric_number'] == 3
        assert analyze_list[0]['metrics_number_by_level'][3]['metric_number'] == 2
        assert analyze_list[0]['metrics_number_by_level'][4]['metric_number'] == 2
        assert response.status_code == status.HTTP_200_OK