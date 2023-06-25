from rest_framework import serializers

from assessment.models import QualityAttributeValue
from assessment.serializers.commonserializers import QualityAttributeSerilizer
from baseinfo.serializers.assessmentkitserializers import MaturityLevelSimpleSerializer

class SubjectReportSerializer(serializers.ModelSerializer):
    maturity_level = MaturityLevelSimpleSerializer()
    maturity_level_number = serializers.SerializerMethodField()
    maturity_level_status = serializers.SerializerMethodField()
    level_value = serializers.SerializerMethodField()
    quality_attribute = QualityAttributeSerilizer()

    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'quality_attribute', 'maturity_level', 'maturity_level_number', 'maturity_level_status', 'level_value']

  
    
    def get_maturity_level_status(self, att_value : QualityAttributeValue):
        return att_value.maturity_level.title
    
    def get_level_value(self, att_value : QualityAttributeValue):
        return att_value.maturity_level.value + 1

    
    def get_maturity_level_number(self, att_value: QualityAttributeValue):
        return att_value.assessment_result.assessment_project.assessment_kit.maturity_levels.count()
    
