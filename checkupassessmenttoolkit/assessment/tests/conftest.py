import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from assessmentcore.models import User, Space, UserAccess
from assessment.models import AssessmentProfile
from assessmentbaseinfo.models import AssessmentSubject, MetricCategory
from assessmentbaseinfo.models import Metric, MetricImpact, QualityAttribute
from assessmentbaseinfo.models import AnswerTemplate

from assessment.common import *



@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        space1 = baker.make(Space)
        user1 = baker.make(User, current_space = space1, username = 'test')
        user_access11 = baker.make(UserAccess, space = space1, user = user1)
        return api_client.force_authenticate(user1)
    return do_authenticate

@pytest.fixture
def init_data():
    def do_init_data():
        profile = AssessmentProfile.objects.filter(is_default=True).first()
        metric_category_list = []
        metric_category_list.append(baker.make(MetricCategory, assessment_profile = profile))
        metric_category_list.append(baker.make(MetricCategory, assessment_profile = profile))
        metric_category_list.append(baker.make(MetricCategory, assessment_profile = profile))
        metric_category_list.append(baker.make(MetricCategory, assessment_profile = profile))

        metrics_list = []
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[0], index = 1))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[0], index = 2))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[0], index = 3))

        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[1], index = 1))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[1], index = 2))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[1], index = 3))

        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[2], index = 1))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[2], index = 2))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[2], index = 3))

        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[3], index = 1))
        metrics_list.append(baker.make(Metric, metric_category = metric_category_list[3], index = 2))

        answer_templates = []
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[0], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[0], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[1], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[1], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[1], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[2], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[2], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[2], value = 4))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[2], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[3], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[3], value = 2))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[3], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[3], value = 4))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[3], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[4], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[4], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[5], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[5], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[5], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[6], value = 2))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[6], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[7], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[7], value = 4))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[7], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[8], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[8], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[9], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[9], value = 5))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[10], value = 1))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[10], value = 2))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[10], value = 3))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[10], value = 4))
        answer_templates.append(baker.make(AnswerTemplate, metric = metrics_list[10], value = 5))
        
        subject1 = baker.make(AssessmentSubject, assessment_profile = profile, metric_categories = [metric_category_list[0], metric_category_list[1]])
        subject2 = baker.make(AssessmentSubject, assessment_profile = profile,  metric_categories = [metric_category_list[2], metric_category_list[3]])


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


        #att2
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
        base_info.add("metric_categories", metric_category_list)
        base_info.add("metrics", metrics_list)
        base_info.add("answer_templates", answer_templates)
        base_info.add("subject1", subject1)
        base_info.add("subject2", subject2)
        base_info.add("subject2", subject2)
        base_info.add("attributes", atts)
        base_info.add("impacts", metric_impacts)
         
        return base_info
        
    return do_init_data







