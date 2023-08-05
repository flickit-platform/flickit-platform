import pytest
import json

from rest_framework import status
from rest_framework.test import APIRequestFactory 
from baseinfo.views import assessmentkitviews , commonviews


@pytest.mark.django_db
class TestLoadOptionValuesWithAnswerTamplate:
    def test_load_option_values_when_answer_tamplate_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        answer_tamplate_id = base_info['answer_template'][0].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/answer-template/{answer_tamplate_id}/option-values/', {}, format='json')
        view = commonviews.LoadOptionValueInternalApi.as_view()
        resp = view(request,answer_tamplate_id)

        #responses testing
        option_value = base_info['option_value'][0]
        data = resp.data['items']
        
        assert  resp.status_code == status.HTTP_200_OK 
        assert  data[0]['id'] == option_value.id
        assert  data[0]['option_id'] == answer_tamplate_id
        assert  data[0]['value'] == option_value.value
        assert  data[0]['question_impact_id'] == option_value.question_impact.id
        
    def test_load_option_values_when_answer_tamplate_not_exist(self):
        #init data
        
        #create request and send request
        answer_tamplate_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/answer-template/{answer_tamplate_id}/option-values/', {}, format='json')
        view = commonviews.LoadOptionValueInternalApi.as_view()
        resp = view(request,answer_tamplate_id)

        #responses testing
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"
        
        

@pytest.mark.django_db
class TestLoadAssessmentSubjectsWithAssessmentKit:
    def test_load_assessment_subjects_when_assessment_kit_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-kit/{assessment_kit_id}/assessment-subjects/', {}, format='json')
        view = commonviews.LoadAssessmentSubjectInternalApi.as_view()
        resp = view(request,assessment_kit_id)

        #responses testing
        assert  resp.status_code == status.HTTP_200_OK 
        subjects1 = base_info['subject1']
        attributes = base_info['attributes']
        data = resp.data['items']
        assert  data[0]['id'] == subjects1.id   
        assert  data[0]['quality_attributes'][0]['id'] == attributes[0].id
        assert  data[0]['quality_attributes'][0]['weight'] == attributes[0].weight
        
    def test_load_assessment_subjects_when_assessment_kit_not_exist(self):
        #init data
        
        #create request and send request
        assessment_kit_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-kit/{assessment_kit_id}/assessment-subjects/', {}, format='json')
        view = commonviews.LoadAssessmentSubjectInternalApi.as_view()
        resp = view(request,assessment_kit_id)

        #responses testing
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"
        

@pytest.mark.django_db
class TestLoadLevelCompetencesWithMaturityLevel:
    def test_load_level_competences_when_maturity_level_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        maturity_level_id = base_info['maturity_levels'][0].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/maturity-level/{maturity_level_id}/level-competences/', {}, format='json')
        view = assessmentkitviews.LoadLevelCompetenceInternalApi.as_view()
        resp = view(request,maturity_level_id)
        
        assert  resp.status_code == status.HTTP_200_OK
        level_competences = base_info['level_competences']
        data = resp.data["items"]
        assert data[0]["id"] == level_competences[0].id
        
    def test_load_level_competences_when_maturity_level_not_exist(self):
        #init data
        
        #create request and send request
        maturity_level_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/maturity-level/{maturity_level_id}/level-competences/', {}, format='json')
        view = assessmentkitviews.LoadLevelCompetenceInternalApi.as_view()
        resp = view(request,maturity_level_id)
        
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"
        
        

@pytest.mark.django_db
class TestLoadLevelWithAssessmentKit:
    def test_load_maturity_levels_when_assessment_kit_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        assessment_kit_id = base_info['assessment_kit'].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-kit/{assessment_kit_id}/maturity-levels/', {}, format='json')
        view = assessmentkitviews.LoadMaturityLevelInternalApi.as_view()
        resp = view(request,assessment_kit_id)
        
        assert  resp.status_code == status.HTTP_200_OK
        maturity_levels = base_info['maturity_levels']
        data = resp.data["items"]
        assert data[0]["id"] == maturity_levels[0].id

    def test_load_maturity_levels_when_assessment_kit_not_exist(self):
        
        #create request and send request
        assessment_kit_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-kit/{assessment_kit_id}/maturity-levels/', {}, format='json')
        view = assessmentkitviews.LoadMaturityLevelInternalApi.as_view()
        resp = view(request,assessment_kit_id)
        
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"


        
@pytest.mark.django_db
class TestLoadQuestionsWithQualityAttribute:
    def test_load_questions_when_quality_attribute_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        quality_attribute_id = base_info['attributes'][0].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/quality-attribute/{quality_attribute_id}/question/', {}, format='json')
        view = commonviews.LoadQuestionInternalApi.as_view()
        resp = view(request,quality_attribute_id)
        
        assert  resp.status_code == status.HTTP_200_OK
        questions = base_info['questions']
        data = resp.data["items"]
        assert data[0]["id"] == questions[0].id
        
        
    def test_load_questions_when_quality_attribute_not_exist(self):
        #init data
        
        #create request and send request
        quality_attribute_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/quality-attribute/{quality_attribute_id}/question/', {}, format='json')
        view = commonviews.LoadQuestionInternalApi.as_view()
        resp = view(request,quality_attribute_id)
        
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"
        

@pytest.mark.django_db
class TestLoadQualityAttributesWithAssessmentSubject:
    def test_load_quality_attributes_when_assessment_subject_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        assessment_subject_id = base_info['subject1'].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-subject/{assessment_subject_id}/quality-attributes/', {}, format='json')
        view = commonviews.LoadQualityAttributeInternalApi.as_view()
        resp = view(request,assessment_subject_id)
        
        assert  resp.status_code == status.HTTP_200_OK
        attributes = base_info['attributes']
        data = resp.data["items"]
        assert data[0]["id"] == attributes[0].id
        
    def test_load_quality_attributes_when_assessment_subject_not_exist(self,init_data):
        #init data
        
        #create request and send request
        assessment_subject_id = 1000
        api = APIRequestFactory()
        request = api.get(f'/api/internal/assessment-subject/{assessment_subject_id}/quality-attributes/', {}, format='json')
        view = commonviews.LoadQualityAttributeInternalApi.as_view()
        resp = view(request,assessment_subject_id)
        
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"
        
        
@pytest.mark.django_db
class TestLoadQuestionImpactWithQuestionImpactId:
    def test_load_question_impact_when_question_impact_id_exist(self,init_data):
        #init data
        base_info = init_data()
        
        #create request and send request
        question_impact_id = base_info['question_impacts'][0].id
        api = APIRequestFactory()
        request = api.get(f'/api/internal/questionimpact/{question_impact_id}/', {}, format='json')
        view = commonviews.LoadQuestionImpactInternalApi.as_view()
        resp = view(request,question_impact_id)
        
        assert  resp.status_code == status.HTTP_200_OK
        question_impacts = base_info['question_impacts']
        data = resp.data["items"]
        assert data[0]["id"] == question_impacts[0].id
        
    def test_load_question_impact_when_question_impact_id_not_exist(self):
        #init data
        
        #create request and send request
        question_impact_id = -1
        api = APIRequestFactory()
        request = api.get(f'/api/internal/questionimpact/{question_impact_id}/', {}, format='json')
        view = commonviews.LoadQuestionImpactInternalApi.as_view()
        resp = view(request,question_impact_id)
        
        assert  resp.status_code == status.HTTP_404_NOT_FOUND
        assert  resp.data["message"] == "Object does not exists"