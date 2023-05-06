
import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from assessment.models import AssessmentProfile


@pytest.fixture
def create_user():
    def do_create_user(email):
        user = baker.make(User, email = email)
        return user
    return do_create_user

@pytest.fixture
def create_profile():
    def do_create_profile(assessmentprofile):
        profile = baker.make(assessmentprofile)
        return profile
    return do_create_profile

@pytest.fixture
def create_expertgroup():
    def do_create_expertgroup(expertgroup ,user):
        expert_group = baker.make(expertgroup)
        expert_group.users.add(user)
        return expert_group
    return do_create_expertgroup

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        space1 = baker.make(Space)
        user1 = baker.make(User, current_space = space1, email = 'test@test.com')
        user_access11 = baker.make(UserAccess, space = space1, user = user1)
        return api_client.force_authenticate(user1)
    return do_authenticate

@pytest.fixture
def init_data():
    def do_init_data():
        profile = baker.make(AssessmentProfile)
        return profile
    return do_init_data