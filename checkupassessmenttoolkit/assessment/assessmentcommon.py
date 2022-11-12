from statistics import mean
from assessmentbaseinfo.models import MetricCategory, AssessmentSubject
from .models import AssessmentProject, AssessmentResult

ANSWERED_QUESTION_NUMBER_BOUNDARY = 5

def calculate_staus(value):
    match value:
        case 1:
            return "WEAK"
        case 2:
            return "RISKY"
        case 3:
            return "NORMAL"
        case 4:
            return "GOOD"
        case 5:
            return "OPTIMIZED"


def extract_total_answered_metric_number(result: AssessmentResult, category: MetricCategory):
    metrics = category.metric_set.all()
    answered_metric = 0
    total_answered_metric_number = 0
    for metric in metrics:
        metric_values = metric.metric_values
        for value in metric_values.filter(assessment_result_id=result.id):
            if value.metric_id == metric.id:
                if value.answer is not None:
                    answered_metric += 1
    total_answered_metric_number += answered_metric
    return total_answered_metric_number

def calculate_answered_metric_by_subject(result: AssessmentResult, subject: AssessmentSubject):
    total_answered_metric_number = 0
    for category in subject.metric_categories.all():
        total_answered_metric_number += extract_total_answered_metric_number(result, category) 
    return total_answered_metric_number

def calculate_total_metric_number_by_subject(subject: AssessmentSubject):
    total_metric_number = 0
    for category in subject.metric_categories.all():
        metrics = category.metric_set.all()
        total_metric_number += len(metrics)
    return total_metric_number

def calculate_answered_metric_by_result(result:AssessmentResult):
    total_answered_metric_number = 0
    for category in MetricCategory.objects.filter(assessment_profile_id = result.assessment_project.assessment_profile_id):
        total_answered_metric_number += extract_total_answered_metric_number(result, category) 
    return total_answered_metric_number

def calculate_total_metric_number_by_result(result:AssessmentResult):
    total_metric_number = 0
    for category in MetricCategory.objects.filter(assessment_profile_id = result.assessment_project.assessment_profile_id):
        metrics = category.metric_set.all()
        total_metric_number += len(metrics)
    return total_metric_number


def update_assessment_status(result:AssessmentResult):
    total_answered_metric_number = calculate_answered_metric_by_result(result) 
    if total_answered_metric_number <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
        status = None
    else:
        value = round(mean([item.maturity_level_value for item in result.quality_attribute_values.all()]))
        status = calculate_staus(value)
    assessment = AssessmentProject.objects.get(id = result.assessment_project.id)           
    assessment.status = status
    assessment.save()
