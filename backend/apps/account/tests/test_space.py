import pytest
from rest_framework import status
from model_bakery import baker
from rest_framework.test import APIRequestFactory
from account.views.spaceviews import SpaceLeaveUserAPI, SpaceAccessAPI
from rest_framework.test import force_authenticate
from account.models import User, Space, UserAccess

from unittest import skip



@pytest.fixture
def create_space(api_client):
    def do_create_space(space):
        return api_client.post('/authinfo/spaces/', space)

    return do_create_space


@pytest.fixture
def leave_space(api_client):
    def do_leave_space(space_id):
        return api_client.post('/authinfo/spaces/leave/' + space_id, {}, follow=True)

    return do_leave_space


@pytest.fixture
def init_space():
    def do_init_data():
        space_list = {}

        # create users
        user1_mail = "user1@test.com"
        user1 = baker.make(User, email=user1_mail)

        user2_mail = "user2@test.com"
        user2 = baker.make(User, email=user2_mail)

        # create two space
        current_space = baker.make(Space, code='01', title="current_space_test_user1", owner=user1)
        default_space = baker.make(Space, code='02', title="default_space_test_user1", owner=user1)
        UserAccess.objects.create(user=user1, space=current_space, created_by=user1)
        UserAccess.objects.create(user=user1, space=default_space, created_by=user1)
        assess = UserAccess.objects.create(user=user2, space=current_space, created_by=user2)

        space_list["user1"] = current_space, default_space, user1_mail

        # create two space
        current_space = baker.make(Space, code='03', title="current_space_test_user2", owner=user2)
        default_space = baker.make(Space, code='04', title="default_space_test_user2", owner=user2)
        UserAccess.objects.create(user=user2, space=current_space, created_by=user2)
        UserAccess.objects.create(user=user2, space=default_space, created_by=user2)
        space_list["user2"] = current_space, default_space, user2_mail

        return space_list

    return do_init_data


@pytest.mark.django_db
@skip
class TestLeaveSpace:
    def test_leave_space_returns_200(self, init_space):
        space_list = init_space()
        user = User.objects.get(email=space_list["user2"][2])

        api = APIRequestFactory()
        request = api.post('/authinfo/spaces/leave/', {}, format='json')
        force_authenticate(request, user=user)
        view = SpaceLeaveUserAPI.as_view()
        resp = view(request, space_list["user1"][0].id)

        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'Leaving from the space is done successfully.'

    def test_leave_space_returns_400(self, init_space):
        space_list = init_space()
        user = User.objects.get(email=space_list["user1"][2])

        api = APIRequestFactory()
        request = api.post('/authinfo/spaces/leave/', {}, format='json')
        force_authenticate(request, user=user)
        view = SpaceLeaveUserAPI.as_view()
        resp = view(request, space_list["user1"][1].id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'Not allowed to perform this action. '


@pytest.mark.django_db
@skip
class TestCreateSpace:
    def test_if_user_is_anonymous_returns_401(self, create_space):
        response = create_space({'title': 'a'})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_invaliSpaceLeaveUserAPId_returns_400(self, authenticate, create_space):
        authenticate(is_staff=True)

        response = create_space({'title': ''})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['title'] is not None

    def test_if_data_is_valid_returns_201(self, authenticate, create_space):
        authenticate(is_staff=True)

        response = create_space({'title': 'a'})

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] > 0


@pytest.mark.django_db
@skip
class TestAddUserToSpace:
    def test_add_user_in_space_success(self, init_space):
        space_list = init_space()
        user = User.objects.get(email=space_list["user1"][2])

        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/{space_list["user1"][1].id}', {'email': space_list["user2"][2]},
                           format='json')
        force_authenticate(request, user=user)
        view = SpaceAccessAPI.as_view()
        resp = view(request, space_list["user1"][1].id)
        assert resp.status_code == status.HTTP_200_OK

        assert resp.data["code"] == "user-joined-space"
        assert resp.data["message"] == "This user has successfully joined the space."

    def test_add_user_in_space_with_user_is_not_member(self, init_space):
        space_list = init_space()
        user = User.objects.get(email=space_list["user2"][2])

        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/{space_list["user1"][1].id}', {'email': space_list["user2"][2]},
                           format='json')
        force_authenticate(request, user=user)
        view = SpaceAccessAPI.as_view()
        resp = view(request, space_list["user1"][1].id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["code"] == "user-not-allowed"
        assert resp.data["message"] == "Only members of the space are allowed to add new members to it."

    def test_add_user_in_space_with_email_is_member(self, init_space):
        space_list = init_space()
        user = User.objects.get(email=space_list["user1"][2])

        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/{space_list["user1"][0].id}', {'email': space_list["user1"][2]},
                           format='json')
        force_authenticate(request, user=user)
        view = SpaceAccessAPI.as_view()
        resp = view(request, space_list["user1"][1].id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["code"] == "user-is-member"
        assert resp.data["message"] == "This user is already a member of this space."

    def test_add_user_in_space_with_uesr_not_active(self, init_space):
        user3_mail = "user3@test.com"
        user3 = baker.make(User, email=user3_mail)
        user3.is_active = False
        user3.save()

        space_list = init_space()
        user = User.objects.get(email=space_list["user2"][2])

        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/{space_list["user1"][0].id}', {'email': user3_mail},
                           format='json')
        force_authenticate(request, user=user)
        view = SpaceAccessAPI.as_view()
        resp = view(request, space_list["user1"][0].id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["code"] == "user-not-exist"
        assert resp.data["message"] == "No user with the given email was found."

    def test_add_user_in_space_with_uesr_not_exist(self, init_space):
        user3_mail = "user3@test.com"

        space_list = init_space()
        user = User.objects.get(email=space_list["user2"][2])

        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/{space_list["user1"][0].id}', {'email': user3_mail},
                           format='json')
        force_authenticate(request, user=user)
        view = SpaceAccessAPI.as_view()
        resp = view(request, space_list["user1"][0].id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data["code"] == "user-not-exist"
        assert resp.data["message"] == "No user with the given email was found."

    def test_add_user_in_space_when_user_not_login(self):
        api = APIRequestFactory()
        request = api.post(f'/authinfo/spaces/adduser/1', {'email': 'test@test.test'}, format='json')
        view = SpaceAccessAPI.as_view()
        resp = view(request, 1)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED



