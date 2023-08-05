from statistics import mean
from assessment.models import AssessmentResult
from assessment.fixture.common import ANSWERED_QUESTION_NUMBER_BOUNDARY
from assessment.fixture.dictionary import Dictionary
from assessment.services import questionstatistic

from baseinfo.services import maturitylevelservices



def calculate_subjects_info(result: AssessmentResult):
    subjects_info = []
    subjects = result.assessment_project.assessment_kit.assessment_subjects.all()
    quality_attribute_values = result.quality_attribute_values.all()
    for subject in subjects:
        subject_info = extract_base_info(subject)
        calculate_progress_param(result, subject, subject_info)

        if subject_info['total_answered_question_number'] <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
            subject_info.add("status", "Not Calculated")
        else:
            calculate_subject_status(quality_attribute_values, subject, subject_info)

        subjects_info.append(subject_info)
    return subjects_info 

def calculate_subject_status(quality_attribute_values, subject, subject_info):
    subject_maturity_level_values = []
    for quality_attribute_value in quality_attribute_values:
        if quality_attribute_value.quality_attribute.assessment_subject.id == subject.id:
            subject_maturity_level_values.append(quality_attribute_value.maturity_level.value)
    if subject_maturity_level_values:
        maturity_level = maturitylevelservices.extract_maturity_level_by_value(assessment_kit = subject.assessment_kit, value = round(mean(subject_maturity_level_values)))
        subject_info.add("status", maturity_level.title)

def extract_base_info(subject):
    subject_info = Dictionary()
    subject_info.add("id", subject.id)
    subject_info.add("title", subject.title)
    subject_info.add("description", subject.description)
    return subject_info

def calculate_progress_param(result, subject, subject_info):
    total_question_number = questionstatistic.calculate_total_question_number_by_subject(subject)
    total_answered_question_number = questionstatistic.calculate_answered_question_by_subject(result, subject)
    
    if total_question_number != 0:
        subject_info.add("progress", ((total_answered_question_number / total_question_number) * 100))
    else:
        subject_info.add("progress", 0)
    subject_info.add("total_question_number", total_question_number)
    subject_info.add("total_answered_question_number", total_answered_question_number) 

