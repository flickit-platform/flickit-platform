from statistics import mean
from rest_framework import serializers

from assessmentbaseinfo.serializers import AssessmentProfileSimpleSerilizer

from ..models import AssessmentProject, AssessmentResult
from assessment.serializers import ColorSerilizer
from assessmentcore.serializers import SpaceSerializer
from assessmentbaseinfo.models import *
from ..common import *
import more_itertools

class AssessmentProjectReportSerilizer(serializers.ModelSerializer):
    color = ColorSerilizer()
    space = SpaceSerializer()
    assessment_profile = AssessmentProfileSimpleSerilizer()
    class Meta:
        model = AssessmentProject
        fields = ['title', 'last_modification_date', 'color', 'assessment_results', 'space', 'assessment_profile']

                
class AssessmentReportSerilizer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField(method_name='calculate_total_maturity_level')
    assessment_project = AssessmentProjectReportSerilizer()
    subjects_info = serializers.SerializerMethodField(method_name='calculate_subjects_info')
    most_significant_strength_atts = serializers.SerializerMethodField()
    most_significant_weaknessness_atts = serializers.SerializerMethodField()

    def calculate_subjects_info(self, result: AssessmentResult):
        subjects_info = []
        subjects = result.assessment_project.assessment_profile.assessment_subjects.all()
        quality_attribute_values = result.quality_attribute_values.all()
        for subject in subjects:
            subject_info = self.extract_base_info(subject)
            self.calculate_progress_param(result, subject, subject_info)

            if subject_info['total_answered_metric_number'] <= 5:
                subject_info.add("status", "Not Calculated")
            else:
                self.calculate_subject_status(quality_attribute_values, subject, subject_info)

            subjects_info.append(subject_info)
        return subjects_info 

    def calculate_subject_status(self, quality_attribute_values, subject, subject_info):
        subject_maturity_level_values = []
        for quality_attribute_value in quality_attribute_values:
            if quality_attribute_value.quality_attribute.assessment_subject.id == subject.id:
                subject_maturity_level_values.append(quality_attribute_value.maturity_level_value)
        if subject_maturity_level_values:
            subject_info.add("status", calculate_staus(round(mean(subject_maturity_level_values))))

    def extract_base_info(self, subject):
        subject_info = Dictionary()
        subject_info.add("id", subject.id)
        subject_info.add("title", subject.title)
        subject_info.add("description", subject.description)
        if subject.images.first() is not None:
            subject_info.add("image", subject.images.first().image.url)
        return subject_info

    def calculate_progress_param(self, result, subject, subject_info):
        total_metric_number = 0
        total_answered_metric_number = 0
        for category in subject.metric_categories.all():
            metrics = category.metric_set.all()
            total_metric_number += len(metrics)
            answered_metric = 0
            for metric in metrics:
                metric_values = metric.metric_values
                for value in metric_values.filter(assessment_result_id=result.id):
                    if value.metric_id == metric.id:
                        if value.answer is not None:
                            answered_metric += 1
            total_answered_metric_number += answered_metric 
        if total_metric_number != 0:
            subject_info.add("progress", ((total_answered_metric_number / total_metric_number) * 100))
        else:
             subject_info.add("progress", 0)
        subject_info.add("total_metric_number", total_metric_number)
        subject_info.add("total_answered_metric_number", total_answered_metric_number) 

        
    def sort_att_values(self, result):
        quality_attribute_values = result.quality_attribute_values.order_by('-maturity_level_value').all()

        print(quality_attribute_values)
        # print([o['quality_attribute'] for o in quality_attribute_values if o['maturity_level_value'] > 2][:2])
        att_dict = Dictionary()
        for quality_attribute_value in quality_attribute_values:
            att_dict.add(quality_attribute_value.quality_attribute.title, quality_attribute_value.maturity_level_value)
        # print(att_dict)
        return att_dict

    def get_most_significant_strength_atts(self, result: AssessmentResult):
        quality_attributes = []
        if result.assessment_project.status is not None:
            for att_value in result.quality_attribute_values.order_by('-maturity_level_value').all():
                if att_value.maturity_level_value > 2:
                    quality_attributes.append(att_value.quality_attribute.title)
            return more_itertools.take(3, quality_attributes)
        else:
            return []
        
    def get_most_significant_weaknessness_atts(self, result: AssessmentResult):
        quality_attributes = []
        if result.assessment_project.status is not None and result.assessment_project.status:
            for att_value in result.quality_attribute_values.order_by('-maturity_level_value').all():
                if att_value.maturity_level_value < 3:
                    quality_attributes.append(att_value.quality_attribute.title)
            return more_itertools.take(3, reversed(quality_attributes))
        else:
            return []
    
    def calculate_total_maturity_level(self, result: AssessmentResult):
        if result.quality_attribute_values.all():
            assessment = AssessmentProject.objects.get(id = result.assessment_project_id)
            return assessment.status
        else:
            return "Not Calculated"

    class Meta:
        model = AssessmentResult
        fields = ['assessment_project', 'status', 'subjects_info', 'most_significant_strength_atts', 'most_significant_weaknessness_atts']    