from rest_framework import status
import pytest
from model_bakery import baker

from assessment.models import AssessmentProject, AssessmentKit, QualityAttributeValue, AssessmentResult
from account.models import User
from unittest import skip


@pytest.fixture
def add_question_value(api_client):
    def do_add_question_value(result_id, question_value):
        return api_client.post('/assessment/results/' + result_id + "/questionvalues/", question_value)

    return do_add_question_value


@pytest.mark.django_db
class Test_Add_question_value:
    def test_add_question_value(self, authenticate, init_data, add_question_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(email='test@test.com')
        assessment_kit = baker.make(AssessmentKit)
        project = baker.make(AssessmentProject, assessment_kit=assessment_kit, space=test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        answer_template_wit_value_5_for_question_11_id = answer_tempaltes[1].id

        questions = base_info['questions']
        question11_id = questions[0].id
        AssessmentResult.objects.create(assessment_project_id=project.id)
        result_id = project.assessment_results.all()[0].id
        response = add_question_value(str(result_id), {'answer': answer_template_wit_value_5_for_question_11_id,
                                                       'question_id': question11_id})
        att_values = QualityAttributeValue.objects.filter(assessment_result_id=project.assessment_results.all()[0].id)
        # assert att_values.first().maturity_level_value == 2
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] is not None

    def test_add_question_value_invalid_question(self, authenticate, init_data, add_question_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(email='test@test.com')
        assessment_kit = baker.make(AssessmentKit)
        project = baker.make(AssessmentProject, assessment_kit=assessment_kit, space=test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        answer_template_wit_value_5_for_question_11_id = answer_tempaltes[10].id

        questions = base_info['questions']
        question11_id = questions[0].id
        AssessmentResult.objects.create(assessment_project_id=project.id)
        result_id = project.assessment_results.all()[0].id
        response = add_question_value(str(result_id), {'answer': answer_template_wit_value_5_for_question_11_id,
                                                       'question_id': question11_id})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['non_field_errors'][0] == 'The options is invalid'


@pytest.mark.django_db
class Test_calculate_maturity_level_value:
    @skip
    def test_calculate_maturity_level(self, api_client, authenticate, init_data, add_question_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(email='test@test.com')
        assessment_kit = baker.make(AssessmentKit)
        project = baker.make(AssessmentProject, assessment_kit=assessment_kit, space=test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        questions = base_info['questions']
        AssessmentResult.objects.create(assessment_project_id=project.id)
        result_id = project.assessment_results.all()[0].id

        # level 1
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[1].id, 'question_id': questions[0].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[4].id, 'question_id': questions[1].id})  # Answer value = 5

        # level 2
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[7].id, 'question_id': questions[2].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[12].id, 'question_id': questions[3].id})  # Answer value = 4
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[15].id, 'question_id': questions[4].id})  # Answer value = 5

        # level 3
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[17].id, 'question_id': questions[5].id})  # Answer value = 3
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[20].id, 'question_id': questions[6].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[22].id, 'question_id': questions[7].id})  # Answer value = 4

        # level 4
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[25].id, 'question_id': questions[8].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[26].id, 'question_id': questions[9].id})  # Answer value = 3

        # level 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[28].id, 'question_id': questions[10].id})  # Answer value = 5

        att_values = QualityAttributeValue.objects.filter(assessment_result_id=project.assessment_results.all()[0].id)

        response = api_client.get('/assessment/reports/' + str(project.id) + "/")

        sorted_att_values = att_values.order_by('-maturity_level__value').all()
        assert sorted_att_values[0].maturity_level.value == 4
        assert sorted_att_values[1].maturity_level.value == 4
        assert sorted_att_values[2].maturity_level.value == 3
        assert response.data['maturity_level']['title'] == "Great"
        assert response.data['most_significant_strength_atts'][0] == sorted_att_values[0].quality_attribute.title


@pytest.mark.django_db
class Test_Report_Subject:
    def test_report_subject(self, api_client, authenticate, init_data, add_question_value):
        authenticate(is_staff=True)
        test_user = User.objects.get(email='test@test.com')
        assessment_kit = baker.make(AssessmentKit)
        project = baker.make(AssessmentProject, assessment_kit=assessment_kit, space=test_user.current_space)
        base_info = init_data()

        answer_tempaltes = base_info['answer_templates']
        questions = base_info['questions']
        AssessmentResult.objects.create(assessment_project_id=project.id)
        result_id = project.assessment_results.all()[0].id

        # level 1
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[1].id, 'question_id': questions[0].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[4].id, 'question_id': questions[1].id})  # Answer value = 5

        # level 2
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[7].id, 'question_id': questions[2].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[12].id, 'question_id': questions[3].id})  # Answer value = 4
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[15].id, 'question_id': questions[4].id})  # Answer value = 5

        # level 3
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[17].id, 'question_id': questions[5].id})  # Answer value = 3
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[20].id, 'question_id': questions[6].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[22].id, 'question_id': questions[7].id})  # Answer value = 4

        # level 4
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[25].id, 'question_id': questions[8].id})  # Answer value = 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[26].id, 'question_id': questions[9].id})  # Answer value = 3

        # level 5
        add_question_value(str(result_id),
                           {'answer': answer_tempaltes[28].id, 'question_id': questions[10].id})  # Answer value = 5

        assessment_result_pk = project.assessment_results.all()[0].id
        att_values = QualityAttributeValue.objects.filter(assessment_result_id=assessment_result_pk)

        subject1 = base_info['subject1']
        response = api_client.get(
            '/assessment/reportsubject/?assessment_subject_pk=' + str(subject1.id) + '&assessment_result_pk=' + str(
                assessment_result_pk))

        sorted_att_values = att_values.order_by('-maturity_level__value').all()

        # assert len(response.data['questionnaires_info']) == 2
        # assert response.data['questionnaires_info'][0]['question_number'] == 3
        # assert response.data['questionnaires_info'][1]['answered_question'] == 3
        assert sorted_att_values[0].maturity_level.value == 4
        assert sorted_att_values[1].maturity_level.value == 4
        assert sorted_att_values[2].maturity_level.value == 3
        assert response.data['status'] == "Great"
        # assert response.data['most_significant_strength_atts'][0]['title'] == sorted_att_values[0].quality_attribute.title
