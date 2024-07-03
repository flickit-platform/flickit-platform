from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
import pytest
from model_bakery import baker
from baseinfo.views import assessmentkitviews, commonviews
from baseinfo.models.questionmodels import Question, QuestionImpact, MaturityLevel
from baseinfo.models.assessmentkitmodels import ExpertGroup, AssessmentKitLike, AssessmentKit, ExpertGroupAccess
from account.models import User
from unittest import skip


@pytest.fixture
def init_assessment_kit():
    def do_create_assessment_kit(authenticate, create_expertgroup):
        authenticate()
        test_user = User.objects.get(email='test@test.com')
        permission = Permission.objects.get(name='Manage Expert Groups')
        test_user.user_permissions.add(permission)
        test_user.save()
        assessment_kit = baker.make(AssessmentKit, title='p1')
        expert_group = create_expertgroup(ExpertGroup, test_user)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()
        return assessment_kit

    return do_create_assessment_kit

@pytest.mark.django_db
class TestLikeAssessmentKits:
    @skip
    def test_like_assessment_kit_return_200(self, authenticate, init_assessment_kit, create_expertgroup):
        assessment_kit = init_assessment_kit(authenticate, create_expertgroup)
        user1 = User.objects.get(email="test@test.com")
        AssessmentKitLike(assessment_kit=assessment_kit)
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.post(f'/baseinfo/assessmentkits/like/{assessment_kit.id}/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.AssessmentKitLikeApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["likes"] == 1


@pytest.mark.django_db
class TestAssessmentKitListOptions:
    def test_assessment_kit_list_options_return_200(self, create_expertgroup):
        user1 = baker.make(User, email="test@test.com")
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
        force_authenticate(request, user=user1)
        view = assessmentkitviews.AssessmentKitListOptionsApi.as_view()
        resp = view(request)

        assert resp.status_code == status.HTTP_200_OK
        assert len(resp.data["results"]) == 1


@pytest.mark.django_db
class TestExpertGroupeListAssessmentKit:
    def test_get_list_assessment_kit_when_user_unauthorized(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)

        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_list_assessment_kit_when_user_not_member_expert_group(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1 = baker.make(AssessmentKit)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()

        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        force_authenticate(request, user=user2)
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)
        results = resp.data["results"]
        assert resp.status_code == status.HTTP_200_OK
        assert results["published"][0]["id"] == assessment_kit1.id
        assert ("unpublished" in results) == False

    def test_get_list_assessment_kit_when_user_member_expert_group(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit1 = baker.make(AssessmentKit)
        assessment_kit1.expert_group = expert_group
        assessment_kit1.is_active = True
        assessment_kit1.save()
        assessment_kit2 = baker.make(AssessmentKit)
        assessment_kit2.expert_group = expert_group
        assessment_kit2.is_active = False
        assessment_kit2.save()

        api = APIRequestFactory()
        request = api.get(f'expertgroup/{expert_group.id}/assessmentkits/', format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()
        resp = view(request, expert_group.id)

        results = resp.data["results"]
        assert resp.status_code == status.HTTP_200_OK
        assert results["published"][0]["id"] == assessment_kit1.id
        assert results["unpublished"][0]["id"] == assessment_kit2.id


@pytest.mark.django_db
class TestLoadAssessmentKitInfoEditableApi:
    def test_get_assessment_kit_info_editable_when_user_expert_groups_is_member(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user2, created_by=user2,
                                         last_modified_by=user2)
        expert_group.users.add(user2)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user=user2)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)

        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit_id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["summary"] == assessment_kit.summary
        assert "tags" in resp.data
        assert resp.data["price"] == 0
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["is_private"] == assessment_kit.is_private

    def test_get_assessment_kit_info_editable_when_user_expert_groups_not_member(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user=user2)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"

    def test_get_assessment_kit_info_editable_when_user_unauthorized(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = assessment_kit.id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_assessment_kit_info_editable_when_assessment_kit_id_not_exsist(self, create_user, create_expertgroup):
        user1 = create_user(email="test@test.com")
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit = baker.make(AssessmentKit)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        assessment_kit_id = 100

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/info/')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"


@pytest.mark.django_db
class TestEditAssessmentKitInfoApi:
    def test_edit_assessment_kit_when_user_is_owner(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code="tc1", title="devops")
        tag2 = create_tag(code="tc2", title="team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        data = {
            "data": {
                "tags": [tag2.id],
                "title": "test2",
                "summary": "test2",
                "about": "<p>test2</p>",
                "is_active": True,
                "is_private": False,
                "price": 0,
            }
        }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user1)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["is_private"] == assessment_kit.is_private
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag2.id
        assert user1 == expert_group.owner

    def test_edit_assessment_kit_when_user_is_member_expert_groups(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user2, created_by=user2,
                                         last_modified_by=user2)
        expert_group.users.add(user2)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user2)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'

    def test_edit_assessment_kit_when_user_not_member_expert_groups(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email="test@test.com")
        user2 = create_user(email="test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user2)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'

    def test_edit_assessment_kit_when_user_is_member_not_valid_field(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()

        # tag id not exist
        data = {
            "data": {
                "tags": [1, 100]
            }
        }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user1)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == "'tag_id' does not exists."

        # assessment kit id not exist
        assessment_kit_id = 1000
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit_id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user1)
        resp = view(request, assessment_kit_id=assessment_kit_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['code'] == "NOT_FOUND"
        assert resp.data['message'] == "'assessment_kit_id' does not exist"

    def test_edit_assessment_kit_when_user_unauthorized(self, create_user, create_expertgroup, create_tag):
        user1 = create_user(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.save()

        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', {}, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit.id)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_edit_assessment_kit_when_user_is_member_expert_groups_no_editing(self, create_user, create_expertgroup,
                                                                              create_tag):
        user1 = create_user(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = baker.make(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        tag1 = create_tag(code="tc1", title="devops")
        tag2 = create_tag(code="tc2", title="team")
        assessment_kit.code = "tu1"
        assessment_kit.title = "title user1"
        assessment_kit.about = "about user 1"
        assessment_kit.summary = "summary user1"
        assessment_kit.tags.add(tag1)
        assessment_kit.tags.add(tag2)
        assessment_kit.save()

        # empty data
        data = {}
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user1)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag1.id
        assert user1 == expert_group.owner
        # field not exist
        data = {
            "data": {
                "test": "test"
            }
        }
        api = APIRequestFactory()
        request = api.patch(f'/api/v1/assessment-kits/{assessment_kit.id}/', data, format='json')
        view = assessmentkitviews.EditAssessmentKitInfoApi.as_view()
        force_authenticate(request, user=user1)
        resp = view(request, assessment_kit_id=assessment_kit.id)

        assessment_kit.refresh_from_db()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == assessment_kit.id
        assert resp.data["title"] == assessment_kit.title
        assert resp.data["summary"] == assessment_kit.summary
        assert resp.data["about"] == assessment_kit.about
        assert resp.data["is_active"] == assessment_kit.is_active
        assert resp.data["price"] == 0
        assert resp.data["tags"][0]["id"] == tag1.id
        assert user1 == expert_group.owner


@pytest.mark.django_db
class TestLoadMaturityLevelsApi:
    def test_get_maturity_levels_with_assessment_kit_id_when_user_login(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/maturity-levels/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadMaturityLevelApi.as_view()
        resp = view(request, assessment_kit_id)

        assert resp.status_code == status.HTTP_200_OK
        maturity_levels = base_info['maturity_levels']
        data = resp.data["items"]
        assert data[0]["id"] == maturity_levels[0].id

    def test_get_maturity_levels_when_assessment_kit_id_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/maturity-levels/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadMaturityLevelApi.as_view()
        resp = view(request, assessment_kit_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_maturity_levels_when_user_unauthorized(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/maturity-levels/', {}, format='json')
        view = assessmentkitviews.LoadMaturityLevelApi.as_view()
        resp = view(request, assessment_kit_id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadAssessmentKitDetailsApi:

    def test_get_assessment_kit_details_when_user_is_member(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)
        expert_group.save()
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        assert resp.status_code == status.HTTP_200_OK
        for i in ["subjects", "questionnaires", "maturity_levels"]:
            assert i in resp.data

    def test_get_assessment_kit_details_when_user_not_member(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group.save()
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_assessment_kit_details_when_not_exist_assessment_kit(self, create_user):
        user1 = create_user(email="test@test.com")
        # init data

        # create request and send request
        assessment_kit_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/', {}, format='json')
        force_authenticate(request, user=user1)
        view = assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_assessment_kit_details_when_user_unauthorized(self, init_data):
        # init data
        base_info = init_data()

        # create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/', {}, format='json')
        view = assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadAssessmentSubjectDetailsApi:

    def test_get_assessment_subject_details_when_user_is_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        subject = base_info['subject1']
        subject_id = subject.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        questions_count = Question.objects.filter(quality_attributes__assessment_subject=subject_id).distinct().count()
        description = subject.description
        attributes_count = subject.quality_attributes.count()

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadAssessmentSubjectDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, subject_id=subject_id)
        assert resp.status_code == status.HTTP_200_OK
        for i in ["questions_count", "description", "attributes"]:
            assert i in resp.data
        assert resp.data["questions_count"] == questions_count
        assert resp.data["description"] == description
        assert len(resp.data["attributes"]) == attributes_count

    def test_get_assessment_subject_details_when_user_not_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        subject = base_info['subject1']
        subject_id = subject.id

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadAssessmentSubjectDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, subject_id=subject_id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_assessment_subject_details_when_subject_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        subject = base_info['subject1']
        subject_id = 1000
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadAssessmentSubjectDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, subject_id=subject_id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'subject_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_assessment_subject_details_when_assessment_kit_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = 1000
        subject = base_info['subject1']
        subject_id = subject.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadAssessmentSubjectDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, subject_id=subject_id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_assessment_subject_details_when_user_unauthorized(self, init_data):
        base_info = init_data()
        assessment_kit_id = 1000
        subject_id = 1000

        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}/', {},
                          format='json')
        view = commonviews.LoadAssessmentSubjectDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, subject_id=subject_id)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadQualityAttributesDetailsApi:
    def test_get_quality_attributes_details_when_is_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        attribute_id = attribute.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQualityAttributesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id)
        assert resp.status_code == status.HTTP_200_OK
        for i in ["id", "index", "title", "questions_count", "weight", "description", "questions_on_levels"]:
            assert i in resp.data
        assert resp.data["id"] == attribute.id
        assert resp.data["index"] == attribute.index
        assert resp.data["title"] == attribute.title
        assert resp.data["weight"] == attribute.weight
        assert resp.data["description"] == attribute.description
        assert resp.data["questions_count"] == attribute.question_set.count()
        counter = len(resp.data["questions_on_levels"])
        levels = MaturityLevel.objects.filter(kit_version=attribute.assessment_subject.kit_version.id).order_by('value')
        assert counter == levels.count()
        for level_counter in range(counter):
            assert levels[level_counter].id == resp.data["questions_on_levels"][level_counter]["id"]
            assert levels[level_counter].title == resp.data["questions_on_levels"][level_counter]["title"]
            assert levels[level_counter].value == resp.data["questions_on_levels"][level_counter]["index"]
            questions_count = QuestionImpact.objects.filter(maturity_level=levels[level_counter].id).filter(
                quality_attribute=attribute_id).distinct().values('question__id').count()
            assert questions_count == resp.data["questions_on_levels"][level_counter]["questions_count"]

    def test_get_quality_attributes_details_when_user_not_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        attribute_id = attribute.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQualityAttributesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id)
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_quality_attributes_details_when_attribute_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute_id = 1000
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQualityAttributesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'attribute_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_quality_attributes_details_when_assessment_kit_not_exist(self, create_user):
        user1 = create_user(email="test@test.com")
        assessment_kit_id = 1000
        attribute_id = 1000

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/', {},
                          format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQualityAttributesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_quality_attributes_details_when_user_unauthorized(self, init_data):
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        attribute_id = attribute.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/', {},
                          format='json')
        view = commonviews.LoadQualityAttributesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadMaturityLevelsDetailsApi:
    def test_get_maturity_levels_details_when_user_is_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        level = base_info['maturity_levels'][1]
        level_id = level.id
        attribute_id = attribute.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        questions_count = QuestionImpact.objects.filter(maturity_level=level_id).filter(
            quality_attribute=attribute_id).distinct().values('question__id').count()
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == level_id
        assert resp.data["title"] == level.title
        assert resp.data["index"] == level.value
        assert resp.data["questions_count"] == questions_count

    def test_get_maturity_levels_details_when_not_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        level = base_info['maturity_levels'][1]
        level_id = level.id
        attribute_id = attribute.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_maturity_levels_details_when_assessment_kit_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = 1000
        attribute = base_info['attributes'][0]
        level = base_info['maturity_levels'][1]
        level_id = level.id
        attribute_id = attribute.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_maturity_levels_details_when_attribute_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        level_id = 1000
        attribute_id = 1000
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'attribute_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_maturity_levels_details_when_maturity_levels_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        attribute = base_info['attributes'][0]
        level_id = 1000
        attribute_id = attribute.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'level_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_maturity_levels_details_when_user_unauthorized(self, init_data):
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        level_id = 1000
        attribute_id = 1000
        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{level_id}/',
            {},
            format='json')
        view = commonviews.LoadMaturityLevelsDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, attribute_id=attribute_id, maturity_level_id=level_id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadQuestionnairesDetailsApi:
    def test_get_questionnaires_details_when_user_is_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        questionnaire = base_info['questionnaires'][0]
        questionnaire_id = questionnaire.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionnairesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, questionnaire_id=questionnaire_id)
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["questions_count"] == Question.objects.filter(questionnaire=questionnaire_id).count()
        assert resp.data["description"] == questionnaire.description

    def test_get_questionnaires_details_when_user_not_member_expert_group(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        questionnaire = base_info['questionnaires'][0]
        questionnaire_id = questionnaire.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionnairesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, questionnaire_id=questionnaire_id)

        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_questionnaires_details_when_assessment_kit_not_exist(self, create_user, init_data):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = 1000
        questionnaire = base_info['questionnaires'][0]
        questionnaire_id = questionnaire.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionnairesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, questionnaire_id=questionnaire_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_questionnaires_details_when_questionnaires_not_exist(self, init_data, create_user):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        questionnaire_id = 1000
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionnairesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, questionnaire_id=questionnaire_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'questionnaire_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_questionnaires_details_when_user_unauthorized(self):
        assessment_kit_id = 1000
        questionnaire_id = 1000

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}/',
            {},
            format='json')
        view = commonviews.LoadQuestionnairesDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, questionnaire_id=questionnaire_id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLoadQuestionDetailsApi:
    def test_get_question_details_when_user_is_member_expert_group(self, init_data, create_user):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        question = base_info['questions'][0]
        question_id = question.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questions/{question_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, question_id=question_id)

        assert resp.status_code == status.HTTP_200_OK
        assert 'options' in resp.data
        assert 'attribute_impacts' in resp.data

    def test_get_question_details_when_user_not_member_expert_group(self, init_data, create_user):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        question = base_info['questions'][0]
        question_id = question.id

        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questions/{question_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, question_id=question_id)

        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_get_question_details_when_assessment_kit_not_exist(self, init_data, create_user):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = 1000
        question = base_info['questions'][0]
        question_id = question.id
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)
        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questions/{question_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, question_id=question_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'assessment_kit_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_question_details_when_question_not_exist(self, init_data, create_user):
        user1 = create_user(email="test@test.com")
        # init data
        base_info = init_data()
        assessment_kit_id = base_info['assessment_kit'].id
        question_id = 1000
        expert_group = base_info['assessment_kit'].expert_group
        expert_group_access = baker.make(ExpertGroupAccess, expert_group=expert_group, user=user1, created_by=user1,
                                         last_modified_by=user1)
        expert_group.users.add(user1)
        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questions/{question_id}/',
            {},
            format='json')
        force_authenticate(request, user=user1)
        view = commonviews.LoadQuestionDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, question_id=question_id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["message"] == "'question_id' does not exist"
        assert resp.data["code"] == "NOT_FOUND"

    def test_get_question_details_when_user_unauthorized(self):
        assessment_kit_id = 1000
        question_id = 1000
        # create request and send request
        api = APIRequestFactory()
        request = api.get(
            f'/api/v1/assessment-kits/{assessment_kit_id}/details/questions/{question_id}/',
            {},
            format='json')
        view = commonviews.LoadQuestionDetailsApi.as_view()
        resp = view(request, assessment_kit_id=assessment_kit_id, question_id=question_id)

        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
