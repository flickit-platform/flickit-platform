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
class Test_QuestionaryView:
    def test_questionary_report(self, api_client, authenticate, init_data, add_metric_value):
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

        # level 2
        add_metric_value(str(result_id), {'answer': answer_tempaltes[7].id, 'metric_id': metrics[2].id}) # Answer value = 5
        add_metric_value(str(result_id), {'answer': answer_tempaltes[15].id, 'metric_id': metrics[4].id}) # Answer value = 5
        

        # level 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[17].id, 'metric_id': metrics[5].id}) # Answer value = 3
        add_metric_value(str(result_id), {'answer': answer_tempaltes[22].id, 'metric_id': metrics[7].id}) # Answer value = 4

        # level 4
        add_metric_value(str(result_id), {'answer': answer_tempaltes[25].id, 'metric_id': metrics[8].id}) # Answer value = 5

        response = api_client.get('/assessment/questionaries/' + str(project.id) + "/")
    
        assert response.status_code == status.HTTP_200_OK
        print(str(response.data))
        print(len(response.data['questionaries_info']))

        newlist = sorted(base_info['metric_categories'], key=lambda x: x.index, reverse=True)

        assert response.data['questionaries_info'][0]['title'] == newlist[0].title
        assert response.data['questionaries_info'][0]['metric_number'] == 2
        assert response.data['questionaries_info'][0]['answered_metric'] == 0
        assert response.data['questionaries_info'][0]['progress'] == 0.0
        assert response.data['questionaries_info'][0]['current_metric_index'] == 1
        
        assert response.data['questionaries_info'][1]['title'] == newlist[1].title
        assert response.data['questionaries_info'][1]['metric_number'] == 3
        assert response.data['questionaries_info'][1]['answered_metric'] == 2
        assert response.data['questionaries_info'][1]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][1]['current_metric_index'] == 1

        assert response.data['questionaries_info'][2]['title'] == newlist[2].title
        assert response.data['questionaries_info'][2]['metric_number'] == 3
        assert response.data['questionaries_info'][2]['answered_metric'] == 2
        assert response.data['questionaries_info'][2]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][2]['current_metric_index'] == 1

        assert response.data['questionaries_info'][3]['title'] == newlist[3].title
        assert response.data['questionaries_info'][3]['metric_number'] == 3
        assert response.data['questionaries_info'][3]['answered_metric'] == 2
        assert response.data['questionaries_info'][3]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][3]['current_metric_index'] == 2