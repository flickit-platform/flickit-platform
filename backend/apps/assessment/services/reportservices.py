from statistics import mean
from rest_framework import serializers

from baseinfo.serializers.profileserializers import AssessmentProfileSerilizer
from account.serializers.commonserializers import SpaceSerializer

from statistics import mean
from rest_framework import serializers

from baseinfo.serializers.profileserializers import AssessmentProfileSerilizer
from account.serializers.commonserializers import SpaceSerializer

from assessment.serializers.commonserializers import ColorSerilizer
from assessment.models import AssessmentProject, AssessmentResult
from assessment.fixture.common import calculate_staus, ANSWERED_QUESTION_NUMBER_BOUNDARY
from assessment.fixture.dictionary import Dictionary
from assessment.services import attributesstatistics, reportservices, metricstatistic



def calculate_subjects_info(result: AssessmentResult):
    subjects_info = []
    subjects = result.assessment_project.assessment_profile.assessment_subjects.all()
    quality_attribute_values = result.quality_attribute_values.all()
    for subject in subjects:
        subject_info = extract_base_info(subject)
        calculate_progress_param(result, subject, subject_info)

        if subject_info['total_answered_metric_number'] <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
            subject_info.add("status", "Not Calculated")
        else:
            calculate_subject_status(quality_attribute_values, subject, subject_info)

        subjects_info.append(subject_info)
    return subjects_info 

def calculate_subject_status(quality_attribute_values, subject, subject_info):
        subject_maturity_level_values = []
        for quality_attribute_value in quality_attribute_values:
            if quality_attribute_value.quality_attribute.assessment_subject.id == subject.id:
                subject_maturity_level_values.append(quality_attribute_value.maturity_level_value)
        if subject_maturity_level_values:
            subject_info.add("status", calculate_staus(round(mean(subject_maturity_level_values))))

def extract_base_info(subject):
    subject_info = Dictionary()
    subject_info.add("id", subject.id)
    subject_info.add("title", subject.title)
    subject_info.add("description", subject.description)
    return subject_info

def calculate_progress_param(result, subject, subject_info):
    total_metric_number = metricstatistic.calculate_total_metric_number_by_subject(subject)
    total_answered_metric_number = metricstatistic.calculate_answered_metric_by_subject(result, subject)
    
    if total_metric_number != 0:
        subject_info.add("progress", ((total_answered_metric_number / total_metric_number) * 100))
    else:
        subject_info.add("progress", 0)
    subject_info.add("total_metric_number", total_metric_number)
    subject_info.add("total_answered_metric_number", total_answered_metric_number) 

