from rest_framework import status
import pytest
from model_bakery import baker

from assessment.models import AssessmentProject, AssessmentKit, AssessmentResult
from account.models import User

@pytest.fixture
def add_question_value(api_client):
    def do_add_question_value(result_id, question_value):
        return api_client.post('/assessment/results/' + result_id + "/questionvalues/", question_value)
    return do_add_question_value


# TODO: Fix assertion
@pytest.mark.django_db
class Test_QuestionaryView:
    def test_questionary_report(self, api_client, authenticate, init_data, add_question_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(email = 'test@test.com')
        assessment_kit = baker.make(AssessmentKit)
        project = baker.make(AssessmentProject, assessment_kit = assessment_kit, space = test_user.current_space)
        AssessmentResult.objects.create(assessment_project_id = project.id)

        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        questions = base_info['questions']
        result_id = project.assessment_results.all()[0].id

        # level 1
        add_question_value(str(result_id), {'answer': answer_tempaltes[1].id, 'question_id': questions[0].id}) # Answer value = 5

        # level 2
        add_question_value(str(result_id), {'answer': answer_tempaltes[7].id, 'question_id': questions[2].id}) # Answer value = 5
        add_question_value(str(result_id), {'answer': answer_tempaltes[15].id, 'question_id': questions[4].id}) # Answer value = 5
        

        # level 3
        add_question_value(str(result_id), {'answer': answer_tempaltes[17].id, 'question_id': questions[5].id}) # Answer value = 3
        add_question_value(str(result_id), {'answer': answer_tempaltes[22].id, 'question_id': questions[7].id}) # Answer value = 4

        # level 4
        add_question_value(str(result_id), {'answer': answer_tempaltes[25].id, 'question_id': questions[8].id}) # Answer value = 5

        response = api_client.get('/assessment/questionaries/' + str(project.id) + "/")
    
        assert response.status_code == status.HTTP_200_OK


        newlist = sorted(base_info['questionnaires'], key=lambda x: x.index, reverse=True)

        assert response.data['questionaries_info'][3]['title'] == newlist[0].title
        assert response.data['questionaries_info'][3]['question_number'] == 2
        assert response.data['questionaries_info'][3]['answered_question'] == 0
        assert response.data['questionaries_info'][3]['progress'] == 0.0
        assert response.data['questionaries_info'][3]['current_question_index'] == 1
        
        assert response.data['questionaries_info'][2]['title'] == newlist[1].title
        assert response.data['questionaries_info'][2]['question_number'] == 3
        assert response.data['questionaries_info'][2]['answered_question'] == 2
        assert response.data['questionaries_info'][2]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][2]['current_question_index'] == 1

        assert response.data['questionaries_info'][1]['title'] == newlist[2].title
        assert response.data['questionaries_info'][1]['question_number'] == 3
        assert response.data['questionaries_info'][1]['answered_question'] == 2
        assert response.data['questionaries_info'][1]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][1]['current_question_index'] == 1

        assert response.data['questionaries_info'][0]['title'] == newlist[3].title
        assert response.data['questionaries_info'][0]['question_number'] == 3
        assert response.data['questionaries_info'][0]['answered_question'] == 2
        assert response.data['questionaries_info'][0]['progress'] == 66.66666666666666
        assert response.data['questionaries_info'][0]['current_question_index'] == 2