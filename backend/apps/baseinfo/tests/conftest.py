
import pytest
import zipfile
import os
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from assessment.models import AssessmentProfile, MaturityLevel
import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from baseinfo.models.profilemodels import  ProfileTag, ProfileDsl
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.metricmodels import Metric, MetricImpact
from assessment.fixture.dictionary import Dictionary
from django.core.files.uploadedfile import SimpleUploadedFile



@pytest.fixture(scope="session")
def tmp_dir(tmpdir_factory):
    tmp_dir = tmpdir_factory.mktemp("src")
    return tmp_dir

@pytest.fixture
def create_dsl_file():
    def do_create_dsl_file(filename , tmp_dir):
        zip = zipfile.ZipFile(os.path.join(tmp_dir.dirname, filename), "w", zipfile.ZIP_DEFLATED)
        zip.close()
        return os.path.basename(zip.filename)
    return do_create_dsl_file

@pytest.fixture
def create_dsl():
    def do_create_dsl(file_path , profile ,tmp_dir):
        dsl = ProfileDsl()
        file = open(os.path.join(tmp_dir.dirname, file_path),'rb')
        dsl.dsl_file = SimpleUploadedFile(file.name , file.read())
        dsl.profile = profile
        dsl.save()
        return dsl
    return do_create_dsl

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
def create_tag():
    def do_create_tag(code, title):
        tag = baker.make(ProfileTag, code=code, title=title)
        return tag
    return do_create_tag


@pytest.fixture
def init_data():
    def do_init_data():
        profile = AssessmentProfile.objects.filter(title="p1").first()
        questionnaire_list = []
        questionnaire_list.append(baker.make(Questionnaire, assessment_profile = profile, index = 1, title = 'c1'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_profile = profile, index = 2, title = 'c2'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_profile = profile, index = 3, title = 'c3'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_profile = profile, index = 4, title = 'c4'))

        metrics_list = []
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[0], index = 1))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[0], index = 2))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[0], index = 3))

        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[1], index = 1))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[1], index = 2))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[1], index = 3))

        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[2], index = 1))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[2], index = 2))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[2], index = 3))

        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[3], index = 1))
        metrics_list.append(baker.make(Metric, questionnaire = questionnaire_list[3], index = 2))

       
        
        subject1 = baker.make(AssessmentSubject, assessment_profile = profile, questionnaires = [questionnaire_list[0], questionnaire_list[1]])
        subject2 = baker.make(AssessmentSubject, assessment_profile = profile,  questionnaires = [questionnaire_list[2], questionnaire_list[3]])


        atts = []
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject1))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))
        atts.append(baker.make(QualityAttribute, assessment_subject = subject2))     



        metric_impacts = []

        maturity_level_0 = baker.make(MaturityLevel, title = 'Elementary', value = 0, profile = profile)
        maturity_level_1 = baker.make(MaturityLevel, title = 'Weak', value = 1, profile = profile)
        maturity_level_2 = baker.make(MaturityLevel, title = 'Moderate', value = 2, profile = profile)
        maturity_level_3 = baker.make(MaturityLevel, title = 'Good', value = 3, profile = profile)
        maturity_level_4 = baker.make(MaturityLevel, title = 'Great', value = 4, profile = profile)
        maturity_level_5 = baker.make(MaturityLevel, title = 'Exceptional', value = 5, profile = profile)

        #att1
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_1, quality_attribute = atts[0], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_1, quality_attribute = atts[0], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[0], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[0], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_4, quality_attribute = atts[0], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_4, quality_attribute = atts[0], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_5, quality_attribute = atts[0], metric = metrics_list[10]))
        #0-10

        #att2
        #11-21
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_1, quality_attribute = atts[1], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_1, quality_attribute = atts[1], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[1], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[1], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[1], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_4, quality_attribute = atts[1], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_4, quality_attribute = atts[1], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_5, quality_attribute = atts[1], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_5, quality_attribute = atts[1], metric = metrics_list[10]))

        #att3
        #22-32
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_1, quality_attribute = atts[2], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_2, quality_attribute = atts[2], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, maturity_level = maturity_level_3, quality_attribute = atts[2], metric = metrics_list[10]))
    
        base_info = Dictionary()
        base_info.add("questionnaires", questionnaire_list)
        base_info.add("metrics", metrics_list)
        base_info.add("subject1", subject1)
        base_info.add("subject2", subject2)
        base_info.add("subject2", subject2)
        base_info.add("attributes", atts)
         
        return base_info
        
    return do_init_data

