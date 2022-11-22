from rest_framework import status
import pytest
from model_bakery import baker

from assessment.models import AssessmentProject, AssessmentProfile, QualityAttributeValue
from assessmentcore.models import User


@pytest.fixture
def add_metric_value(api_client):
    def do_add_metric_value(result_id, metric_value):
        return api_client.post('/assessment/results/' + result_id + "/metricvalues/", metric_value)
    return do_add_metric_value



@pytest.mark.django_db
class Test_Add_metric_value:
    def test_add_metric_value(self, authenticate, init_data, add_metric_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(username = 'test')
        profile = baker.make(AssessmentProfile, is_default=True)
        project = baker.make(AssessmentProject, assessment_profile = profile, space = test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        answer_template_wit_value_5_for_metric_11_id = answer_tempaltes[1].id

        metrics = base_info['metrics']
        metric11_id = metrics[0].id

        result_id = project.assessment_results.all()[0].id
        response = add_metric_value(str(result_id), {'answer': answer_template_wit_value_5_for_metric_11_id, 'metric_id': metric11_id})
        att_values = QualityAttributeValue.objects.filter(assessment_result_id = project.assessment_results.all()[0].id)
        assert att_values.first().maturity_level_value == 1
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] is not None
    
    def test_add_metric_value_invalid_metric(self, authenticate, init_data, add_metric_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(username = 'test')
        profile = baker.make(AssessmentProfile, is_default=True)
        project = baker.make(AssessmentProject, assessment_profile = profile, space = test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        answer_template_wit_value_5_for_metric_11_id = answer_tempaltes[10].id

        metrics = base_info['metrics']
        metric11_id = metrics[0].id

        result_id = project.assessment_results.all()[0].id
        response = add_metric_value(str(result_id), {'answer': answer_template_wit_value_5_for_metric_11_id, 'metric_id': metric11_id})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['non_field_errors'][0] == 'The options is invalid'


@pytest.mark.django_db
class Test_calculate_maturity_level_value:
    def test_calculate_maturity_level(self, api_client, authenticate, init_data, add_metric_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(username = 'test')
        profile = baker.make(AssessmentProfile, is_default=True)
        project = baker.make(AssessmentProject, assessment_profile = profile, space = test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        metrics = base_info['metrics']
        result_id = project.assessment_results.all()[0].id

        # level 1
        add_metric_value(str(result_id), {'answer': answer_tempaltes[1].id, 'metric_id': metrics[0].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[4].id, 'metric_id': metrics[1].id}) # Answer value = 5

        # level 2
        add_metric_value(str(result_id), {'answer': answer_tempaltes[7].id, 'metric_id': metrics[2].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[12].id, 'metric_id': metrics[3].id}) # Answer value = 4
        add_metric_value(str(result_id), {'answer': answer_tempaltes[15].id, 'metric_id': metrics[4].id}) # Answer value = 5
        

        # level 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[17].id, 'metric_id': metrics[5].id}) # Answer value = 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[20].id, 'metric_id': metrics[6].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[22].id, 'metric_id': metrics[7].id}) # Answer value = 4

        # level 4
        add_metric_value(str(result_id), {'answer': answer_tempaltes[25].id, 'metric_id': metrics[8].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[26].id, 'metric_id': metrics[9].id}) # Answer value = 3

        # level 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[28].id, 'metric_id': metrics[10].id}) # Answer value = 5


        att_values = QualityAttributeValue.objects.filter(assessment_result_id = project.assessment_results.all()[0].id)
        
        response = api_client.get('/assessment/reports/' + str(project.id) + "/")

        sorted_att_values = att_values.order_by('-maturity_level_value').all()
        assert sorted_att_values[0].maturity_level_value == 5
        assert sorted_att_values[1].maturity_level_value == 5
        assert sorted_att_values[2].maturity_level_value == 4
        assert response.data['status'] == "OPTIMIZED"
        assert response.data['most_significant_strength_atts'][0] == sorted_att_values[0].quality_attribute.title

@pytest.mark.django_db
class Test_Report_Subject:
    def test_report_subject(self, api_client, authenticate, init_data, add_metric_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(username = 'test')
        profile = baker.make(AssessmentProfile, is_default=True)
        project = baker.make(AssessmentProject, assessment_profile = profile, space = test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        metrics = base_info['metrics']
        result_id = project.assessment_results.all()[0].id

        # level 1
        add_metric_value(str(result_id), {'answer': answer_tempaltes[1].id, 'metric_id': metrics[0].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[4].id, 'metric_id': metrics[1].id}) # Answer value = 5

        # level 2
        add_metric_value(str(result_id), {'answer': answer_tempaltes[7].id, 'metric_id': metrics[2].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[12].id, 'metric_id': metrics[3].id}) # Answer value = 4
        add_metric_value(str(result_id), {'answer': answer_tempaltes[15].id, 'metric_id': metrics[4].id}) # Answer value = 5
        

        # level 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[17].id, 'metric_id': metrics[5].id}) # Answer value = 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[20].id, 'metric_id': metrics[6].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[22].id, 'metric_id': metrics[7].id}) # Answer value = 4

        # level 4
        add_metric_value(str(result_id), {'answer': answer_tempaltes[25].id, 'metric_id': metrics[8].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[26].id, 'metric_id': metrics[9].id}) # Answer value = 3

        # level 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[28].id, 'metric_id': metrics[10].id}) # Answer value = 5

        assessment_result_pk = project.assessment_results.all()[0].id
        att_values = QualityAttributeValue.objects.filter(assessment_result_id = assessment_result_pk)


        subject1 = base_info['subject1']
        response = api_client.get('/assessment/reportsubject/?assessment_subject_pk=' + str(subject1.id) + '&assessment_result_pk=' + str(assessment_result_pk))

        
        sorted_att_values = att_values.order_by('-maturity_level_value').all()

        # assert len(response.data['metric_categories_info']) == 2
        # assert response.data['metric_categories_info'][0]['metric_number'] == 3
        # assert response.data['metric_categories_info'][1]['answered_metric'] == 3
        assert sorted_att_values[0].maturity_level_value == 5
        assert sorted_att_values[1].maturity_level_value == 5
        assert sorted_att_values[2].maturity_level_value == 4
        assert response.data['status'] == "OPTIMIZED"
        assert response.data['most_significant_strength_atts'][0]['title'] == sorted_att_values[1].quality_attribute.title
