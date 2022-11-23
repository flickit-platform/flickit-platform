from rest_framework import status
import pytest

@pytest.fixture
def create_space(api_client):
    def do_create_space(space):
        return api_client.post('/authinfo/spaces/', space)
    return do_create_space

@pytest.mark.django_db
class TestCreateSpace:
    def test_if_user_is_anonymous_returns_401(self, create_space):
        response = create_space({'title': 'a'})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_data_is_invalid_returns_400(self, authenticate, create_space):
        authenticate(is_staff=True)

        response = create_space({'title': ''})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['title'] is not None

    def test_if_data_is_valid_returns_201(self, authenticate, create_space):
        authenticate(is_staff=True)

        response = create_space({'title': 'a', 'code': 'a'})

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] > 0