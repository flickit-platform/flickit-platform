from rest_framework import serializers

from common.abstractservices import load_model

from baseinfo.serializers.profileserializers import AssessmentProfileSerilizer, MaturityLevelSimpleSerializer
from account.serializers.commonserializers import SpaceSerializer

from assessment.serializers.commonserializers import ColorSerilizer
from assessment.models import AssessmentProject, AssessmentResult
from assessment.services import attributesstatistics, reportservices, metricstatistic

class AssessmentProjectReportSerilizer(serializers.ModelSerializer):
    color = ColorSerilizer()
    space = SpaceSerializer()
    assessment_profile = AssessmentProfileSerilizer()
    class Meta:
        model = AssessmentProject
        fields = ['title', 'last_modification_date', 'color', 'assessment_results', 'space', 'assessment_profile']

                
class AssessmentReportSerilizer(serializers.ModelSerializer):
    # status = serializers.SerializerMethodField(method_name='calculate_total_status')
    assessment_project = AssessmentProjectReportSerilizer()
    subjects_info = serializers.SerializerMethodField(method_name='calculate_subjects_info')
    most_significant_strength_atts = serializers.SerializerMethodField()
    most_significant_weaknessness_atts = serializers.SerializerMethodField()
    total_progress = serializers.SerializerMethodField()
    maturity_level = serializers.SerializerMethodField()
    maturity_level_number = serializers.SerializerMethodField()
    maturity_level_status = serializers.SerializerMethodField()
    level_value = serializers.SerializerMethodField()

    def get_total_progress(self, result: AssessmentResult):
        return metricstatistic.extract_total_progress(result)
        
    def calculate_subjects_info(self, result: AssessmentResult):
        return reportservices.calculate_subjects_info(result)

    def get_most_significant_strength_atts(self, result: AssessmentResult):
        return attributesstatistics.extract_most_significant_strength_atts(result)
        
    def get_most_significant_weaknessness_atts(self, result: AssessmentResult):
        return attributesstatistics.extract_most_significant_weaknessness_atts(result)
    
    # def calculate_total_status(self, result: AssessmentResult):
    #     if result.quality_attribute_values.all():
    #         assessment = load_model(AssessmentProject, result.assessment_project_id)
    #         return assessment.maturity_level.title
    #     else:
    #         return "Not Calculated"
        
    def get_maturity_level_number(self, result: AssessmentResult):
        return result.assessment_project.assessment_profile.maturity_levels.count()
    
    def get_maturity_level(self, result: AssessmentResult):
        return MaturityLevelSimpleSerializer(result.assessment_project.maturity_level).data
    
    def get_maturity_level_status(self, result: AssessmentResult):
        if result.quality_attribute_values.all():
            assessment = load_model(AssessmentProject, result.assessment_project_id)
            return assessment.maturity_level.title
        else:
            return "Not Calculated"
    
    def get_level_value(self, result: AssessmentResult):
        if result.quality_attribute_values.all():
            assessment = load_model(AssessmentProject, result.assessment_project_id)
            return assessment.maturity_level.value + 1
        else:
            return None

    class Meta:
        model = AssessmentResult
        fields = ['assessment_project', 'subjects_info', 'most_significant_strength_atts', 'most_significant_weaknessness_atts', 'total_progress', 'maturity_level', 'maturity_level_number', 'maturity_level_status', 'level_value']    