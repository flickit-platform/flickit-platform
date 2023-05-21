from statistics import mean

from common.restutil import ActionResult

from baseinfo.models.basemodels import AssessmentSubject
from baseinfo.services import maturitylevelservices

from assessment.models import AssessmentResult
from assessment.services.questionnairereport import QuestionnaireReportInfo
from assessment.fixture.common import ANSWERED_QUESTION_NUMBER_BOUNDARY
from assessment.services import metricstatistic

def calculate_report(assessment_subject_pk, assessment_result_id, quality_attribute_values):
    report = {}

    assessment_result = extract_assessment_result(assessment_result_id)
    questionnaires = extract_questionnaire_from_assessment_result(assessment_result, assessment_subject_pk)

    base_info_report = extract_base_info(assessment_result, assessment_subject_pk)
    report.update(base_info_report)

    questionnaire_report_info = extract_questionnaire_info(questionnaires, assessment_result.id)
    report['total_metric_number'] = questionnaire_report_info.total_metric_number
    report['total_answered_metric'] = questionnaire_report_info.total_answered_metric
    if questionnaire_report_info.total_metric_number != 0:
        report['progress'] = int((report['total_answered_metric'] / report['total_metric_number']) * 100)
    else:
        report['progress'] = 0
  
    report['total_progress'] = metricstatistic.extract_total_progress(assessment_result)
    
    if questionnaire_report_info.total_answered_metric <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
        report['status'] = 'Not Calculated'
        report['no_insight_yet_message'] = 'To view insights, you need to answer more questions'
        report['results'] = None
    else:
        report_details = extract_report_details(quality_attribute_values)
        value = calculate_maturity_level_value(quality_attribute_values)
        maturity_level = maturitylevelservices.extract_maturity_level_by_value(profile = assessment_result.assessment_project.assessment_profile, value = value)
        report_details['status'] = maturity_level.title
        report_details['maturity_level_value'] = maturity_level.value
        report.update(report_details)
    return ActionResult(success=True, data=report)

def extract_assessment_result(result_id):
    return AssessmentResult.objects.filter(pk=result_id).first()

def extract_questionnaire_from_assessment_result(result, assessment_subject_pk):
    return result.assessment_project.assessment_profile.questionnaires\
        .filter(assessment_subjects__id = assessment_subject_pk).all()

def extract_base_info(assessment_result: AssessmentResult, assessment_subject_pk):
    base_info_report = {}
    base_info_report['assessment_project_title'] = assessment_result.assessment_project.title
    base_info_report['assessment_project_id'] = assessment_result.assessment_project_id
    base_info_report['assessment_profile_description'] = assessment_result.assessment_project.assessment_profile.summary

    if assessment_result.assessment_project.color is not None :
        base_info_report['assessment_project_color_code'] = assessment_result.assessment_project.color.color_code   
    if assessment_result.assessment_project.space is not None:
        base_info_report['assessment_project_space_id'] = assessment_result.assessment_project.space_id
        base_info_report['assessment_project_space_title'] = assessment_result.assessment_project.space.title
    base_info_report['title'] = AssessmentSubject.objects.get(pk=assessment_subject_pk).title
    return base_info_report

def extract_report_details(quality_attribute_values):
    report_detail = {}
    if not quality_attribute_values:
        report_detail['status'] = 'Not Calculated'
    else:
        report_detail['most_significant_strength_atts'] = extract_most_significant_strength_atts(quality_attribute_values)
        report_detail['most_significant_weaknessness_atts'] = extract_most_significant_weaknessness_atts(quality_attribute_values)
    return report_detail

def calculate_maturity_level_value(quality_attribute_values):
    return round(mean([item['maturity_level']['value'] for item in quality_attribute_values]))

def extract_most_significant_weaknessness_atts(quality_attribute_values):
    return [o['quality_attribute'] for o in quality_attribute_values  if o['maturity_level']['value'] < 3][:-3:-1]

def extract_most_significant_strength_atts(quality_attribute_values):
    return [o['quality_attribute'] for o in quality_attribute_values if o['maturity_level']['value'] > 2][:2]
 

def extract_questionnaire_info(questionnaires, assessment_result_pk):
    questionnaire_report_info = QuestionnaireReportInfo(questionnaires)
    questionnaire_report_info.calculate_questionnaire_info(assessment_result_pk)
    # response.data['questionnaires_info'] = questionnaire_report_info.questionnaires_info
    return questionnaire_report_info

    