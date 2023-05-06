from baseinfo.models.basemodels import QualityAttribute, AssessmentSubject
from assessment.models import QualityAttributeValue, AssessmentResult
from assessment.services.maturitylevel import calculate_maturity_level

def is_qulaity_attribute_value_exists(result_id):
    return QualityAttributeValue.objects.filter(assessment_result_id = result_id).exists()

def init_quality_attribute_value(result_id):
    assessment_result = AssessmentResult.objects.get(id = result_id)
    subjects = assessment_result.assessment_project.assessment_profile.assessment_subjects.all()
    atts = []
    for sub in subjects:
        sub_attributes = QualityAttribute.objects.filter(assessment_subject = sub).all()
        for sub_att in sub_attributes:
            atts.append(sub_att)
    for att in atts:
        try:
            QualityAttributeValue.objects.get(assessment_result_id = result_id, quality_attribute_id = att.id)
        except QualityAttributeValue.DoesNotExist:
            QualityAttributeValue.objects.create(assessment_result_id = result_id, quality_attribute_id = att.id, maturity_level_value = 1)

def save_qauality_att_value(metric_impacts, assessment_result):
    quality_attributes = []
    for mi in metric_impacts:
        quality_attributes.append(mi.quality_attribute)
    for quality_attribute in quality_attributes:
        maturity_level_value = calculate_maturity_level(assessment_result, quality_attribute)
        try:
            att_value = QualityAttributeValue.objects.get(assessment_result_id = assessment_result.id, quality_attribute_id = quality_attribute.id)
            att_value.maturity_level_value = maturity_level_value
            att_value.save() 
        except QualityAttributeValue.DoesNotExist:
            QualityAttributeValue.objects.create(assessment_result_id = assessment_result.id, quality_attribute_id = quality_attribute.id, maturity_level_value = maturity_level_value)
