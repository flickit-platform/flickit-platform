from account.models import User
from rest_framework.test import APIClient
from model_bakery import baker
import pytest


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        user = baker.make(User, email = 'test@test.com')
        return api_client.force_authenticate(user)
    return do_authenticate











