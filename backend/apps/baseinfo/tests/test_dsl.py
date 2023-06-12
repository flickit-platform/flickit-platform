import pytest
import os
import zipfile
import io
import filecmp
from assessment.models import AssessmentKit, AssessmentProject
from baseinfo.models.assessmentkitmodels import ExpertGroup ,AssessmentKitLike 
from account.models import User
from rest_framework.test import APIRequestFactory ,force_authenticate
from django.contrib.auth.models import Permission
from baseinfo.views import importassessmentkitviews
from rest_framework import status


@pytest.mark.django_db
class TestDownloadDslFile:
    def test_download_dsl_file_return_404(self, create_user, create_expertgroup, create_assessment_kit, create_dsl, create_dsl_file, tmp_dir , settings):
        #init data
        settings.MEDIA_URL = '/media/'
        settings.MEDIA_ROOT = os.path.join(tmp_dir.dirname , "media")
        
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = create_assessment_kit(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        dsl_file_path = create_dsl_file("dsl.zip",tmp_dir)
        dsl = create_dsl(dsl_file_path, assessment_kit ,tmp_dir)

        
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/dsl/download/{assessment_kit.id+10}', {}, format='json')
        force_authenticate(request, user = user1)
        view = importassessmentkitviews.DownloadDslApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id+10)

        #responses testing
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"   

    def test_download_dsl_file_return_400(self, create_user, create_expertgroup, create_assessment_kit, create_dsl, create_dsl_file, tmp_dir , settings):
        #init data
        settings.MEDIA_URL = '/media/'
        settings.MEDIA_ROOT = os.path.join(tmp_dir.dirname , "media")
        
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = create_assessment_kit(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        dsl_file_path = create_dsl_file("dsl.zip",tmp_dir)
        dsl = create_dsl(dsl_file_path, assessment_kit ,tmp_dir)
        dsl.assessment_kit = None
        dsl.save()
        
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/dsl/download/{assessment_kit.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = importassessmentkitviews.DownloadDslApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)

        #responses testing
        assert  resp.status_code == status.HTTP_400_BAD_REQUEST
        assert  resp.data["message"] == "There is no such assessment_kit with this id"
        
        
        dsl.assessment_kit = assessment_kit
        dsl.save()
        os.remove(dsl.dsl_file.path)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/dsl/download/{assessment_kit.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = importassessmentkitviews.DownloadDslApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)
        
        #responses testing
        assert  resp.status_code == status.HTTP_400_BAD_REQUEST
        assert  resp.data["message"] == "No such file exists in storage"
        
        
    def test_download_dsl_file_return_403(self, create_user, create_expertgroup, create_assessment_kit, create_dsl, create_dsl_file, tmp_dir , settings):
        #init data
        settings.MEDIA_URL = '/media/'
        settings.MEDIA_ROOT = os.path.join(tmp_dir.dirname , "media")
        
        user1 = create_user(email = "test@test.com")
        user2 = create_user(email = "test2@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        user2.user_permissions.add(permission)
        assessment_kit = create_assessment_kit(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        dsl_file_path = create_dsl_file("dsl.zip",tmp_dir)
        dsl = create_dsl(dsl_file_path, assessment_kit ,tmp_dir)
        
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/dsl/download/{assessment_kit.id}', {}, format='json')
        force_authenticate(request, user = user2)
        view = importassessmentkitviews.DownloadDslApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)

        #responses testing
        assert  resp.status_code == status.HTTP_403_FORBIDDEN  


    def test_download_dsl_file_return_200(self, create_user, create_expertgroup, create_assessment_kit, create_dsl, create_dsl_file, tmp_dir , settings):
        #init data
        settings.MEDIA_URL = '/media/'
        settings.MEDIA_ROOT = os.path.join(tmp_dir.dirname , "media")
        
        user1 = create_user(email = "test@test.com")
        permission = Permission.objects.get(name='Manage Expert Groups')
        user1.user_permissions.add(permission)
        assessment_kit = create_assessment_kit(AssessmentKit)
        expert_group = create_expertgroup(ExpertGroup, user1)
        assessment_kit.expert_group = expert_group
        assessment_kit.is_active = True
        assessment_kit.save()
        dsl_file_path = create_dsl_file("dsl.zip",tmp_dir)
        dsl = create_dsl(dsl_file_path, assessment_kit ,tmp_dir)

        
        #create request and send request
        api = APIRequestFactory()
        request = api.get(f'/baseinfo/dsl/download/{assessment_kit.id}', {}, format='json')
        force_authenticate(request, user = user1)
        view = importassessmentkitviews.DownloadDslApi.as_view()
        resp = view(request, assesssment_kit_id = assessment_kit.id)

        #responses testing
        assert  resp.status_code == status.HTTP_200_OK
        assert  resp.filename == "assessmentkit.zip"

