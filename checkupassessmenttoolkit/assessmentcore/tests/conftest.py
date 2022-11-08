from assessmentcore.models import User
from rest_framework.test import APIClient
import pytest


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        user = User.objects.create(is_staff=is_staff, id = 123, username = 'test', email = 'test@test.ir')
        return api_client.force_authenticate(user=user)
    return do_authenticate


