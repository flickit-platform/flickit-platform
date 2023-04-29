
import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from assessment.models import AssessmentProfile
import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from assessment.models import AssessmentProfile
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.metricmodels import Metric, MetricImpact, AnswerTemplate, OptionValue
from assessment.fixture.dictionary import Dictionary


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

        #att1
        metric_impacts.append(baker.make(MetricImpact, level = 1, quality_attribute = atts[0], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, level = 1, quality_attribute = atts[0], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[0], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[0], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[0], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[0], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[0], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[0], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, level = 4, quality_attribute = atts[0], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, level = 4, quality_attribute = atts[0], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, level = 5, quality_attribute = atts[0], metric = metrics_list[10]))
        #0-10

        #att2
        #11-21
        metric_impacts.append(baker.make(MetricImpact, level = 1, quality_attribute = atts[1], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, level = 1, quality_attribute = atts[1], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[1], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[1], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[1], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[1], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[1], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, level = 4, quality_attribute = atts[1], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, level = 4, quality_attribute = atts[1], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, level = 5, quality_attribute = atts[1], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, level = 5, quality_attribute = atts[1], metric = metrics_list[10]))

        #att3
        #22-32
        metric_impacts.append(baker.make(MetricImpact, level = 1, quality_attribute = atts[2], metric = metrics_list[0]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[2], metric = metrics_list[1]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[2], metric = metrics_list[2]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[2], metric = metrics_list[3]))
        metric_impacts.append(baker.make(MetricImpact, level = 2, quality_attribute = atts[2], metric = metrics_list[4]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[5]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[6]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[7]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[8]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[9]))
        metric_impacts.append(baker.make(MetricImpact, level = 3, quality_attribute = atts[2], metric = metrics_list[10]))
    
        base_info = Dictionary()
        base_info.add("questionnaires", questionnaire_list)
        base_info.add("metrics", metrics_list)
        base_info.add("subject1", subject1)
        base_info.add("subject2", subject2)
        base_info.add("subject2", subject2)
        base_info.add("attributes", atts)
         
        return base_info
        
    return do_init_data

# @pytest.fixture
# def init_data():
#     def do_init_data():
#         profile = baker.make(AssessmentProfile)
#         return profile
#     return do_init_data