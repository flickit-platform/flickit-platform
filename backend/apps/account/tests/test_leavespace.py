import pytest
from rest_framework import status


@pytest.fixture
def create_space(api_client):
    def do_create_space(space):
        return api_client.post('/authinfo/spaces/', space)
    return do_create_space

@pytest.fixture
def leave_space(api_client):
    def do_leave_space(space_id):
        return api_client.post(f'/authinfo/spaces/leave/{space_id}',content_type="application/json" ,follow=True, secure=True)
    return do_leave_space

@pytest.mark.django_db
class TestLeaveSpace:
    def test_leave_space_returns_200(self, authenticate, create_space,leave_space):
        authenticate(is_staff = True)
        response_create_space = create_space({'title': 'test', 'code': 'a1'})
        id_current_space = response_create_space.data['id'] 
        # print(response_create_space.data['id'])
        response_leave_space = leave_space(id_current_space)
        # print((response_leave_space.data))
        assert response_leave_space.status_code == status.HTTP_200_OK
        
        