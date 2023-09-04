from baseinfo.models.questionmodels import AnswerTemplate, OptionValue, Question, QuestionImpact
from baseinfo.models.assessmentkitmodels import MaturityLevel, AssessmentKit
from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute

from baseinfo.services import assessmentkitservice

from django.core.exceptions import ObjectDoesNotExist


def check_subject_in_assessment_kit(assessment_kit_id, subject_id):
    if AssessmentKit.objects.filter(id=assessment_kit_id).filter(assessment_subjects=subject_id).exists():
        return AssessmentSubject.objects.get(id=subject_id)
    return False


def check_attributes_in_assessment_kit(assessment_kit_id, attribute_id):
    if AssessmentKit.objects.filter(id=assessment_kit_id).filter(assessment_subjects__quality_attributes=attribute_id).exists():
        return QualityAttribute.objects.get(id=attribute_id)
    return False


def load_answer_tamplate(answer_tamplate_id) -> AnswerTemplate:
    try:
        return AnswerTemplate.objects.get(id=answer_tamplate_id)
    except AnswerTemplate.DoesNotExist as e:
        raise AnswerTemplate.DoesNotExist


def load_quality_attribute(quality_attribute_id) -> QualityAttribute:
    try:
        return QualityAttribute.objects.get(id=quality_attribute_id)
    except QualityAttribute.DoesNotExist as e:
        raise QualityAttribute.DoesNotExist


def load_question_impact(question_impact_id) -> QuestionImpact:
    try:
        return QuestionImpact.objects.get(id=question_impact_id)
    except QuestionImpact.DoesNotExist as e:
        raise QuestionImpact.DoesNotExist


def load_assessment_subject(assessment_subject_id) -> AssessmentSubject:
    try:
        return AssessmentSubject.objects.get(id=assessment_subject_id)
    except AssessmentSubject.DoesNotExist as e:
        raise AssessmentSubject.DoesNotExist


def get_option_value_with_answer_tamplate(answer_tamplate_id):
    answer_tamplate = load_answer_tamplate(answer_tamplate_id=answer_tamplate_id)
    result = OptionValue.objects.filter(option=answer_tamplate_id)
    return result


def get_assessment_subject_with_assessment_kit(assessment_kit_id):
    try:
        AssessmentKit.objects.get(id=assessment_kit_id)
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
    result = QuestionImpact.objects.filter(id=question_impact_id)
    return result


def get_questions_with_assessmnet_kit_id(assessment_kit_id):
    try:
        AssessmentKit.objects.get(id=assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        return False
    result = Question.objects.filter(questionnaire__assessment_kit=assessment_kit_id).order_by("id")
    return result


def get_answer_option_whit_id(answer_option_ids):
    answer_option_list = answer_option_ids.split(',')
    answer_option_list = [int(x) for x in answer_option_list if x.isdigit()]
    result = AnswerTemplate.objects.filter(id__in=answer_option_list)
    return result


def get_maturity_level_details(maturity_levels, quality_attributes_id):
    data = list()
    for level in maturity_levels:
        data_level = dict()
        data_level['id'] = level.id
        data_level['title'] = level.title
        data_level['index'] = level.value
        questions_count = Question.objects.filter(quality_attributes=quality_attributes_id).filter(question_impacts__maturity_level=level.id).count()
        data_level['questions_count'] = questions_count
        data.append(data_level)
    return data




