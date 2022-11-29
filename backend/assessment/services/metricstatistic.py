from baseinfo.models import MetricCategory, AssessmentSubject
from ..fixture.dictionary import Dictionary
from ..models import AssessmentResult


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

def extract_total_progress(result):
    total_progress = Dictionary()
    total_answered_metric_number = calculate_answered_metric_by_result(result)
    total_metric_number = calculate_total_metric_number_by_result(result)

    total_progress.add("total_answered_metric_number", total_answered_metric_number)
    total_progress.add("total_metric_number", total_metric_number)
    total_progress.add("progress", (total_answered_metric_number/total_metric_number) * 100)
    return total_progress

def extract_subject_total_progress(result: AssessmentResult, subject: AssessmentSubject):
    total_progress = Dictionary()
    total_answered_metric_number = calculate_answered_metric_by_subject(result, subject)
    total_metric_number = calculate_total_metric_number_by_subject(subject)

    total_progress.add("total_answered_metric_number", total_answered_metric_number)
    total_progress.add("total_metric_number", total_metric_number)
    total_progress.add("progress", (total_answered_metric_number/total_metric_number) * 100)
    return total_progress