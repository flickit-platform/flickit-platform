from rest_framework import status
import pytest
from model_bakery import baker

from assessment.models import AssessmentProfile, AssessmentProject
from baseinfo.models.profilemodels import ExpertGroup
from account.models import User


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
