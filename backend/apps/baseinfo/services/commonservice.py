from baseinfo.models.metricmodels import AnswerTemplate ,OptionValue, Metric , MetricImpact
from baseinfo.models.assessmentkitmodels import MaturityLevel 
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
    
def load_metric_impact(metric_impact_id) -> MetricImpact:
    try:
        return MetricImpact.objects.get(id = metric_impact_id)
    except MetricImpact.DoesNotExist as e:
        raise MetricImpact.DoesNotExist
    

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
    assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
    result = AssessmentSubject.objects.filter(assessment_kit=assessment_kit_id)
    return result

def get_metric_with_quality_attribute(quality_attribute_id):
    quality_attribute = load_quality_attribute(quality_attribute_id)
    result = Metric.objects.filter(quality_attributes=quality_attribute_id)
    return result

def get_quality_attribute_with_assessment_subject(assessment_subject_id):
    assessment_subject = load_assessment_subject(assessment_subject_id)
    result = QualityAttribute.objects.filter(assessment_subject=assessment_subject_id)
    return result

def get_metric_impact_with_id(metric_impact_id):
    metric_impact = load_metric_impact(metric_impact_id)
    result = MetricImpact.objects.filter(id = metric_impact_id)
    return result

