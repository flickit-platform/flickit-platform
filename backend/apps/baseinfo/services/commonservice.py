from baseinfo.models.questionmodels import AnswerTemplate ,OptionValue, Question , QuestionImpact
from baseinfo.models.assessmentkitmodels import MaturityLevel , AssessmentKit
from baseinfo.models.basemodels import AssessmentSubject , QualityAttribute

from baseinfo.services import assessmentkitservice

from django.core.exceptions import ObjectDoesNotExist

def load_answer_tamplate(answer_tamplate_id) -> AnswerTemplate:
    try:
        return AnswerTemplate.objects.get(id = answer_tamplate_id)
    except AnswerTemplate.DoesNotExist as e:
        raise AnswerTemplate.DoesNotExist

def load_quality_attribute(quality_attribute_id) -> QualityAttribute:
    try:
        return QualityAttribute.objects.get(id = quality_attribute_id)
    except QualityAttribute.DoesNotExist as e:
        raise QualityAttribute.DoesNotExist
    
def load_question_impact(question_impact_id) -> QuestionImpact:
    try:
        return QuestionImpact.objects.get(id = question_impact_id)
    except QuestionImpact.DoesNotExist as e:
        raise QuestionImpact.DoesNotExist
    

def load_assessment_subject(assessment_subject_id) -> AssessmentSubject:
    try:
        return AssessmentSubject.objects.get(id = assessment_subject_id)
    except AssessmentSubject.DoesNotExist as e:
        raise AssessmentSubject.DoesNotExist


def get_option_value_with_answer_tamplate(answer_tamplate_id):
    answer_tamplate = load_answer_tamplate(answer_tamplate_id = answer_tamplate_id)
    result = OptionValue.objects.filter(option=answer_tamplate_id)
    return result

def get_assessment_subject_with_assessment_kit(assessment_kit_id):
    try:
        AssessmentKit.objects.get(id = assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        return False
    result = AssessmentSubject.objects.filter(assessment_kit=assessment_kit_id)
    return result

def get_question_with_quality_attribute(quality_attribute_id):
    quality_attribute = load_quality_attribute(quality_attribute_id)
    result = Question.objects.filter(quality_attributes=quality_attribute_id)
    return result

def get_quality_attribute_with_assessment_subject(assessment_subject_id):
    assessment_subject = load_assessment_subject(assessment_subject_id)
    result = QualityAttribute.objects.filter(assessment_subject=assessment_subject_id)
    return result

def get_question_impact_with_id(question_impact_id):
    question_impact = load_question_impact(question_impact_id)
    result = QuestionImpact.objects.filter(id = question_impact_id)
    return result

