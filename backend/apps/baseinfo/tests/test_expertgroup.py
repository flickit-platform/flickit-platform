import email
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate
import pytest
from model_bakery import baker

from baseinfo.views import   expertgroupviews
from django.contrib.auth.models import Permission
from assessment.models import AssessmentProfile, AssessmentProject
from baseinfo.models.profilemodels import ExpertGroup
from account.models import User

@pytest.mark.django_db
class TestCreateExpertGroup:
    def test_create_expert_group_return_401(self):
        #create request and send request
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/', {}, format='json')
        view = expertgroupviews.ExpertGroupViewSet.as_view({"POST" : "get_serializer_class"})
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_expert_group_return_403(self, create_user):
        #init data
        user1 = create_user(email = 'test@test.com')
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/', {}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.ExpertGroupViewSet.as_view({"POST" : "get_serializer_class"})
        resp = view(request)
        
        #responses testing
        assert resp.status_code == status.HTTP_403_FORBIDDEN

    def test_create_expert_group_return_400(self, create_user):
        #init data
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/', {}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.ExpertGroupViewSet.as_view({"post" : "create"})
        resp = view(request)
        
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_create_expert_group_return_201(self,create_user):
        #init data
        user1 = create_user(email = "test@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        data = {
                "name": "test",
                "bio": "test",
                "about": "test",
                "website": "http://al.asi",
                "picture": None
        }
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/', data, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.ExpertGroupViewSet.as_view({"post" : "create"})
        
        #responses testing
        resp = view(request)
        assert resp.status_code == status.HTTP_201_CREATED



@pytest.mark.django_db
class TestAddUserInExpertGroup:
    def test_add_user_in_expertgroup_returns_401(self):
        #init data
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/3', {}, format='json')
        # force_authenticate(request, user = user1)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        
        #responses testing
        resp = view(request)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_add_user_in_expertgroup_returns_400(self, create_user, create_expertgroup):
        #init data
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request,expert_group.id)
        
        #responses testing

        assert resp.status_code == status.HTTP_400_BAD_REQUEST

    def test_add_user_in_expertgroup_returns_200(self, create_user, create_expertgroup):
        #init data
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request,expert_group.id)
        
        #responses testing
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
    
