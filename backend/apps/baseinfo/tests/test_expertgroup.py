import pytest
from unittest import skip
from rest_framework import status
from rest_framework.test import APIRequestFactory ,force_authenticate

from account.models import User, Space, UserAccess
from baseinfo.views import   expertgroupviews
from django.contrib.auth.models import Permission
from baseinfo.models.assessmentkitmodels import ExpertGroup , ExpertGroupAccess

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
    def test_add_user_in_expertgroup_when_user_unauthorized(self):
        api = APIRequestFactory()
        request = api.post('baseinfo/expertgroups/3', {}, format='json')
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        
    def test_add_user_in_expertgroup_returns_403(self, create_user, create_expertgroup):
        user1 = create_user(email = "test@test.com" )
        user2 = create_user(email = "test2@test.com" )
        user3 = create_user(email = "test3@test.com" )
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, user1)
        
        api = APIRequestFactory()
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {'email': 'test3@test.com'}, format='json')
        force_authenticate(request, user = user2)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request, expert_group_id = expert_group.id)
        
        expert_group.users.add(user2)
        request = api.post(f'baseinfo/addexpertgroup/{expert_group.id}', {'email': 'test3@test.com'}, format='json')
        force_authenticate(request, user = user2)
        view = expertgroupviews.AddUserToExpertGroupApi.as_view()
        resp = view(request, expert_group_id = expert_group.id)


        assert resp.status_code == status.HTTP_403_FORBIDDEN

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
    


@pytest.mark.django_db
class TestViewExpertGroup:
    def test_expert_group_viewing_by_users_not_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        
        expert_group = create_expertgroup(ExpertGroup, owner)
        
        api_client.force_authenticate(user = user)
        resp = api_client.get(f'/baseinfo/expertgroups/{expert_group.id}/')
        assert resp.status_code == status.HTTP_200_OK
    
    def test_expert_group_viewing_by_users_is_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        member = User.objects.create(email="tes1@test.com")

        expert_group = create_expertgroup(ExpertGroup, owner)
        expert_group.users.add(member)
        
        api_client.force_authenticate(user = member)
        resp = api_client.get(f'/baseinfo/expertgroups/{expert_group.id}/')
        
        expert_group_users = resp.data["users"][1]
        expert_group_owner = resp.data["owner"]
        assert resp.status_code == status.HTTP_200_OK
        assert expert_group_owner["id"] == owner.id
        assert expert_group_owner["email"] == owner.email
        assert expert_group_users["id"] == member.id
        assert expert_group_users["email"] == member.email
        
        
    def test_expert_group_viewing_by_users_is_owner(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        owner.user_permissions.add(permission)
        owner.save()
        expert_group = create_expertgroup(ExpertGroup, owner)

        api_client.force_authenticate(user = owner)
        resp = api_client.get(f'/baseinfo/expertgroups/{expert_group.id}/')
        
        expert_group_users = resp.data["users"][0]
        expert_group_owner = resp.data["owner"]
        assert resp.status_code == status.HTTP_200_OK
        assert expert_group_owner["id"] == owner.id
        assert expert_group_owner["email"] == owner.email
        assert expert_group_users["id"] == owner.id
        assert expert_group_users["email"] == owner.email

@pytest.mark.django_db
class TestEditExpertGroup:
    def test_expert_group_editing_by_users_not_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        
        expert_group = create_expertgroup(ExpertGroup, owner)
        
        api_client.force_authenticate(user = user)
        resp = api_client.put(f'/baseinfo/expertgroups/{expert_group.id}/',json={}, format='json')
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
    
    def test_expert_group_editing_by_users_is_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, owner)
        expert_group.users.add(user)
        
        api_client.force_authenticate(user = user)
        resp = api_client.put(f'/baseinfo/expertgroups/{expert_group.id}/',json={}, format='json')
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'

    def test_expert_group_editing_by_users_is_owner(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        owner.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, owner)

        api_client.force_authenticate(user = owner)
        resp = api_client.put(f'/baseinfo/expertgroups/{expert_group.id}/',
            {
                "name": "test23324",
                "bio": "test",
                "about": "test",
                "website": "http://google.com"
            },  format='json')
        
        assert owner == expert_group.owner
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data["id"] == expert_group.id
        assert resp.data["name"] == "test23324"
        

@pytest.mark.django_db
class TestDeleteUserExpertGroup:
    def test_expert_group_delete_user_by_users_not_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        user1 = User.objects.create(email="tes2@test.com")
        
        expert_group = create_expertgroup(ExpertGroup, owner)
        expert_group.users.add(user)
        expert_group_access_id = ExpertGroupAccess.objects.filter(expert_group=expert_group.id).filter(user=user.id).values_list('id')[0][0]
        
        api_client.force_authenticate(user = user1)
        resp = api_client.delete(f'/baseinfo/expertgroups/{expert_group.id}/expertgroupaccess/{expert_group_access_id}/',json={}, format='json')
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
    
    def test_expert_group_delete_user_by_users_is_member(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, owner)
        expert_group.users.add(user)
        expert_group_access_id = ExpertGroupAccess.objects.filter(expert_group=expert_group.id).filter(user=user.id).values_list('id')[0][0]

        api_client.force_authenticate(user = user)
        resp = api_client.delete(f'/baseinfo/expertgroups/{expert_group.id}/expertgroupaccess/{expert_group_access_id}/',json={}, format='json')
        
        assert resp.status_code == status.HTTP_403_FORBIDDEN
        assert resp.data['message'] == 'You do not have permission to perform this action.'
    
    def test_expert_group_delete_user_by_users_is_owner(self, create_expertgroup,api_client):
        owner = User.objects.create(email="test@test.com")
        user = User.objects.create(email="tes1@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        owner.user_permissions.add(permission)
        expert_group = create_expertgroup(ExpertGroup, owner)
        expert_group.users.add(user)
        expert_group_access_id = ExpertGroupAccess.objects.filter(expert_group=expert_group.id).filter(user=user.id).values_list('id')[0][0]

        api_client.force_authenticate(user = owner)
        resp = api_client.delete(f'/baseinfo/expertgroups/{expert_group.id}/expertgroupaccess/{expert_group_access_id}/')
        assert resp.status_code == status.HTTP_204_NO_CONTENT
