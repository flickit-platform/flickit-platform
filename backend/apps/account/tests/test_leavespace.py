import pytest
from rest_framework import status
from model_bakery import baker
from rest_framework.test import APIRequestFactory
from account.views.spaceviews import SpaceLeaveUserAPI
from rest_framework.test import force_authenticate
from account.models import User, Space, UserAccess


@pytest.fixture
def create_space(api_client):
    def do_create_space(space):
        return api_client.post('/authinfo/spaces/', space)
    return do_create_space

@pytest.fixture
def leave_space(api_client):
    def do_leave_space(space_id):
        return api_client.post('/authinfo/spaces/leave/' + space_id, {}, follow = True)
    return do_leave_space

@pytest.fixture
def init_space():
    def do_init_data():
        user = baker.make(User, email = 'test@test.com')
        curent_space = baker.make(Space, code = '01', title = "current_space_test", owner = user)
        default_space = baker.make(Space, code = '02', title = "default_space_test", owner = user, is_default_space = True)
        user.current_space = curent_space
        user.default_space = default_space
        user.save()

        UserAccess.objects.create(user = user, space = curent_space)
        UserAccess.objects.create(user = user, space = default_space)


        space_list = []
        space_list.append(curent_space)
        space_list.append(default_space)
        return space_list
        
    return do_init_data


@pytest.mark.django_db
class TestLeaveSpace:
    def test_leave_space_returns_200(self, init_space):
        space_list = init_space()
        user = User.objects.get(email = 'test@test.com')
        
        api = APIRequestFactory()
        request = api.post('/authinfo/spaces/leave/', {}, format='json')
        force_authenticate(request, user=user)
        view = SpaceLeaveUserAPI.as_view()
        resp = view(request, space_list[0].id)

        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['message'] == 'Leaving from the space is done successfully.'
        
        resp = view(request, space_list[1].id)
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert resp.data['message'] == 'The user cannot leave the default space.'