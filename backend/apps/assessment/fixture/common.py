from statistics import mean
from assessment.models import AssessmentProject, AssessmentResult
from assessment.services.metricstatistic import calculate_answered_metric_by_result


ANSWERED_QUESTION_NUMBER_BOUNDARY = 5


STATUS_CHOICES = [
    ('WEAK', 'WEAK'),
    ('RISKY', 'RISKY'),
    ('NORMAL', 'NORMAL'),
    ('GOOD', 'GOOD'),
    ('OPTIMIZED', 'OPTIMIZED')
]

def calculate_staus(value):
    if value == 1:
        return "WEAK"
    if value == 2:
        return "RISKY"
    if value == 3:
        return "NORMAL"
    if value == 4:
        return "GOOD"
    if value == 5:
        return "OPTIMIZED"


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

