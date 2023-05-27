
from statistics import mean

from common.restutil import ActionResult, Dictionary
from common.abstractservices import load_model

from baseinfo.models.basemodels import QualityAttribute
from baseinfo.models.profilemodels import MaturityLevel
from baseinfo.services import maturitylevelservices
from baseinfo.serializers.profileserializers import MaturityLevelSimpleSerializer
from assessment.serializers.commonserializers import QualityAttributeValueSerializer

from assessment.models import AssessmentProject
from assessment.serializers import projectserializers
from assessment.fixture.dictionary import Dictionary
from assessment.services import metricstatistic, attributesstatistics

# TODO check assessment profile is the same in compare
def validate_assessment_compare(assessment_projects):
    for project in assessment_projects:
        if not project.maturity_level:
            error_message = 'The assessment with title {} is not evaluated.'.format(project.title)
            return ActionResult(message = error_message, success=False)
    return ActionResult(success=True)

def loadAssessmentsByIdsForComapre(assessment_list_ids):
    assessment_list = []
    for assessment_id in assessment_list_ids:
        assessment = load_model(AssessmentProject, assessment_id)
        assessment_list.append(projectserializers.AssessmentProjectCompareSerilizer(assessment).data)
    return assessment_list

def extract_base_info(assessment_project):
    base_info = Dictionary()
    base_info.add('id', assessment_project.id)
    base_info.add('title', assessment_project.title)
    base_info.add('status', assessment_project.maturity_level.title)
    base_info.add('maturity_level_value', assessment_project.maturity_level.value + 1)
    base_info.add('maturity_level_number', assessment_project.assessment_profile.maturity_levels.count())
    base_info.add('profile', assessment_project.assessment_profile.title)
    return ActionResult(success=True, data=base_info)


def extract_overall_insight(assessment_projects):
    overall_insights = []
    overall_insights.append(extract_space(assessment_projects))
    overall_insights.append(extract_progress(assessment_projects))
    overall_insights.append(extract_strength(assessment_projects))
    overall_insights.append(extract_weakness(assessment_projects))
    return ActionResult(success=True, data=overall_insights)

def extract_space(assessment_projects):
    space_infos = Dictionary()
    space_list = []
    space_infos.add('title', 'Space')
    for assessment_project in assessment_projects:
        space_list.append(assessment_project.space.title)
    space_infos.add('items', space_list)
    return space_infos

def extract_strength(assessment_projects):
    strength_infos = Dictionary()
    strength_list = []
    strength_infos.add('title', 'Strengths')
    for assessment_project in assessment_projects:
        strength = attributesstatistics.extract_most_significant_strength_atts(assessment_project.get_assessment_result())
        strength_list.append(strength)
    strength_infos.add('items', strength_list)
    return strength_infos

def extract_weakness(assessment_projects):
    weakness_infos = Dictionary()
    weakness_list = []
    weakness_infos.add('title', 'Weaknesses')
    for assessment_project in assessment_projects:
        weak = attributesstatistics.extract_most_significant_weaknessness_atts(assessment_project.get_assessment_result())
        weakness_list.append(weak)
    weakness_infos.add('items', weakness_list)
    return weakness_infos

def extract_progress(assessment_projects):
    progress_infos = Dictionary()
    progress_list = []
    progress_infos.add('title', 'Progress')
    for assessment_project in assessment_projects:
        progress_list.append(metricstatistic.extract_total_progress(assessment_project.get_assessment_result()))
    progress_infos.add('items', progress_list)
    return progress_infos

def extract_subject_report(profile, assessment_projects):
    subjects_report_infos = []
    assessment_subjects = profile.assessment_subjects.all()
    for subject in assessment_subjects:
        subject_info = Dictionary()
        subject_report_info = []
        attributes_info = []
        subject_info.add('title', subject.title)

        maturity_level_infos, status_infos = extract_subject_maturity_level_info(assessment_projects, subject)
        progress_info = extract_subject_progress_info(assessment_projects, subject)
        weakness_info = extract_weakness_info(assessment_projects, subject)
        strength_info = extract_strength_info(assessment_projects, subject)
        confidence_infos = extract_subject_confidence_info(assessment_projects, subject)

        subject_report_info.append(status_infos)
        subject_report_info.append(maturity_level_infos)
        subject_report_info.append(confidence_infos)
        subject_report_info.append(progress_info)
        subject_report_info.append(strength_info)
        subject_report_info.append(weakness_info)
        
        subject_atts = subject.quality_attributes.all()
        for att in subject_atts:
            att_info = Dictionary()
            att_info.add('title', att.title)
            for assessment_project in assessment_projects:
                att_value = att.quality_attribute_values.filter(assessment_result_id = assessment_project.get_assessment_result().id).first()
                att_info.add(str(assessment_project.id), att_value.maturity_level.value)
            attributes_info.append(att_info)

        subject_info.add('subject_report_info', subject_report_info)
        subject_info.add('attributes_info', attributes_info)
        subjects_report_infos.append(subject_info)
    return ActionResult(success=True, data=subjects_report_infos)
    


def extract_subject_confidence_info(assessment_projects, subject):
    confidence_infos = Dictionary()
    confidence_infos.add('title', 'Confidence level')
    confidence_list = []
    for assessment_project in assessment_projects:
        confidence_list.append(1)
    
    confidence_infos.add('items', confidence_list)
    return confidence_infos

def extract_strength_info(assessment_projects, subject):
    strength_infos = Dictionary()
    strength_infos.add('title', 'Strengths')
    strength_list = []
    
    for assessment_project in assessment_projects:
        strength_list.append(extract_subject_strength_list_attributes(assessment_project, subject))
    
    strength_infos.add('items', strength_list)
    return strength_infos

def extract_subject_strength_list_attributes(assessment_project, subject):
    att_values = extract_subject_attributes(assessment_project, subject)
    att_ids = [o['quality_attribute']['id'] for o in att_values if o['maturity_level']['value'] > 2][:2]
    return extract_att_titles(att_ids)

def extract_weakness_info(assessment_projects, subject):
    weakness_infos = Dictionary()
    weakness_infos.add('title', 'Weaknesses')
    weakness_list = []
    
    for assessment_project in assessment_projects:
        weakness_list.append(extract_subject_weakness_attributes(assessment_project, subject))
    
    weakness_infos.add('items', weakness_list)
    return weakness_infos

def extract_subject_weakness_attributes(assessment_project, subject):
    att_values = extract_subject_attributes(assessment_project, subject)
    att_ids = [o['quality_attribute']['id'] for o in att_values  if o['maturity_level']['value'] < 3][:-3:-1]
    return extract_att_titles(att_ids)

def extract_att_titles(att_ids):
    att_titles = []
    for att_id in att_ids:
        att_titles.append(QualityAttribute.objects.get(id = att_id).title)
    return att_titles


def extract_subject_progress_info(assessment_projects, subject):
    progress_infos = Dictionary()
    progress_infos.add('title', 'Progress')
    progress_list = []

    for assessment_project in assessment_projects:
        progress_list.append(calculate_subject_progress(assessment_project, subject))
    
    progress_infos.add('items', progress_list)
    return progress_infos

def calculate_subject_progress(assessment_project, subject):
    return metricstatistic.extract_subject_total_progress(assessment_project.get_assessment_result(), subject)

def extract_subject_maturity_level_info(assessment_projects, subject):
    maturity_level_infos = Dictionary()
    maturity_level_infos.add('title', 'Maturity level')
    maturity_level_values = []

    status_infos = Dictionary()
    status_infos.add('title', 'Status')
    status_list = []

    for assessment_project in assessment_projects:
        maturity_level_values.append(calculate_subject_maturity_level(assessment_project, subject))
    
    i = 0
    for maturity_level_value in maturity_level_values:
        ml = maturitylevelservices.extract_maturity_level_by_value(profile = assessment_projects[i].assessment_profile, value = maturity_level_value)
        status_list.append(MaturityLevelSimpleSerializer(ml).data)
        i = i + 1
    maturity_level_infos.add('items', maturity_level_values)
    status_infos.add('items', status_list)
    return maturity_level_infos, status_infos

def calculate_subject_maturity_level(assessment_project, subject):
    att_values = extract_subject_attributes(assessment_project, subject)
    return round(mean([item['maturity_level']['value'] for item in att_values]))

# def calculate_subject_maturity_level(assessment_project, subject):
#     att_values = extract_subject_attributes(assessment_project, subject)
#     maturity_level_ids = [item['maturity_level_id'] for item in att_values]
#     maturity_levels = []
#     for id in maturity_level_ids:
#         maturity_level = load_model(MaturityLevel, id)
#         maturity_levels.append(maturity_level.value)  # Access the 'value' attribute
#     return round(mean(maturity_levels))  # Calculate the mean directly without subscripting



def extract_subject_attributes(assessment_project, subject):
    att_values = assessment_project.get_assessment_result() \
        .quality_attribute_values \
        .filter(quality_attribute__assessment_subject_id = subject.id).order_by('-maturity_level__value')
    return QualityAttributeValueSerializer(list(att_values), many = True).data










