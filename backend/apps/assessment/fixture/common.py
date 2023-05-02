from statistics import mean
from assessment.models import AssessmentProject, AssessmentResult, QualityAttributeValue
from baseinfo.models.basemodels import QualityAttribute
from assessment.services.metricstatistic import calculate_answered_metric_by_result


ANSWERED_QUESTION_NUMBER_BOUNDARY = 5


STATUS_CHOICES = [
    ('ElEMENTARY', 'ElEMENTARY'),
    ('WEAK', 'WEAK'),
    ('MODERATE', 'MODERATE'),
    ('GOOD', 'GOOD'),
    ('GREAT', 'GREAT')
]

def calculate_staus(value):
    if value == 1:
        return "ElEMENTARY"
    if value == 2:
        return "WEAK"
    if value == 3:
        return "MODERATE"
    if value == 4:
        return "GOOD"
    if value == 5:
        return "GREAT"


def update_assessment_status(result:AssessmentResult):
    total_answered_metric_number = calculate_answered_metric_by_result(result) 
    if total_answered_metric_number <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
        status = None
    else:
        subjects = result.assessment_project.assessment_profile.assessment_subjects.all()
        atts = []
        for sub in subjects:
            sub_attributes = QualityAttribute.objects.filter(assessment_subject = sub).all()
            for sub_att in sub_attributes:
                atts.append(sub_att)
        att_values = []
        for att in atts:
            att_att_values = QualityAttributeValue.objects.filter(assessment_result = result, quality_attribute = att).all()
            for att_value in att_att_values:
                att_values.append(att_value)
        value = round(mean([item.maturity_level_value for item in att_values]))
        status = calculate_staus(value)
    assessment = AssessmentProject.objects.get(id = result.assessment_project.id)           
    assessment.status = status
    assessment.save()

