
from baseinfo.models.metricmodels import AnswerTemplate 
from baseinfo.models.profilemodels import MaturityLevel 
from baseinfo.models.basemodels import AssessmentSubject , QualityAttribute

from django.core.exceptions import ObjectDoesNotExist

def load_answer_tamplate(answer_tamplate_id) -> AnswerTemplate:
    try:
        return AnswerTemplate.objects.get(id = answer_tamplate_id)
    except AnswerTemplate.DoesNotExist as e:
        raise AnswerTemplate.DoesNotExist
    
def load_maturity_level(maturity_level_id) -> MaturityLevel:
    try:
        return MaturityLevel.objects.get(id = maturity_level_id)
    except MaturityLevel.DoesNotExist as e:
        raise MaturityLevel.DoesNotExist
    


def load_assessment_subject(assessment_subject_id) -> AssessmentSubject:
    try:
        return AssessmentSubject.objects.get(id = assessment_subject_id)
    except AssessmentSubject.DoesNotExist as e:
        raise AssessmentSubject.DoesNotExist


def load_quality_attribute(quality_attribute_id) -> QualityAttribute:
    try:
        return QualityAttribute.objects.get(id = quality_attribute_id)
    except QualityAttribute.DoesNotExist as e:
        raise QualityAttribute.DoesNotExist


def export_assessment_id_and_quality_attribute_id(profile):
    data={}
    data["assessmentSubjectIds"] = set(QualityAttribute.objects.filter(assessment_subject__assessment_profile=profile.id).values_list(("assessment_subject_id") ,flat=True))
    data["qualityAttributeIds"] = set(QualityAttribute.objects.filter(assessment_subject__assessment_profile=profile.id).values_list(("id") ,flat=True))
    print(f"\n{data}\n")
    return data