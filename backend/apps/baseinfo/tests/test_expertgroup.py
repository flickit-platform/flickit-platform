import pytest
from unittest import skip
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate

from baseinfo.views import   expertgroupviews
from django.contrib.auth.models import Permission
from baseinfo.models.profilemodels import ExpertGroup

@pytest.mark.django_db
class TestCreateExpertGroup:
    def test_create_expert_group_return_401(self, api_client):
        resp = api_client.post('/baseinfo/expertgroups/', {})
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_expert_group_return_403(self, create_user, api_client):
        #init data
        user1 = create_user(email = 'test@test.com')
        api_client.force_authenticate(user1)
        resp = api_client.post('/baseinfo/expertgroups/', {})
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_create_expert_group_return_400(self, create_user, api_client):
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        api_client.force_authenticate(user1)
        resp = api_client.post('/baseinfo/expertgroups/', {})
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_create_expert_group_return_201(self,create_user, api_client):
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        data = {
                "name": "test",
                "bio": "test",
                "about": "test",
                "website": "http://al.asi"
        }
        api_client.force_authenticate(user1)
        resp = api_client.post('/baseinfo/expertgroups/', data)
        assert resp.status_code == status.HTTP_201_CREATED



@pytest.mark.django_db
class TestAddUserInExpertGroup:
    def test_add_user_in_expertgroup_returns_401(self):
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/3', {}, format='json')
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_add_user_in_expertgroup_returns_400(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        api = APIRequestFactory()
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request, expert_group_id = expert_group.id)

        assert resp.status_code == status.HTTP_400_BAD_REQUEST

    @skip("email mock is not ready")
    def test_add_user_in_expertgroup_returns_200(self, create_user, create_expertgroup):
        #init data
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {'email': 'test2@test.com'}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request, expert_group_id = expert_group.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
    
