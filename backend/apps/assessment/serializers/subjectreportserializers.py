from rest_framework import serializers

from assessment.models import QualityAttributeValue
from assessment.serializers.commonserializers import QualityAttributeSerilizer
from baseinfo.serializers.profileserializers import MaturityLevelSimpleSerializer

class SubjectReportSerializer(serializers.ModelSerializer):
    maturity_level = MaturityLevelSimpleSerializer()
    maturity_level_number = serializers.SerializerMethodField()
    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'status', 'quality_attribute', 'maturity_level_value', 'maturity_level', 'maturity_level_number']

    quality_attribute = QualityAttributeSerilizer()
    status = serializers.SerializerMethodField()

    def get_status(self, att_value : QualityAttributeValue):
        return att_value.maturity_level.title
    
    def get_maturity_level_number(self, att_value: QualityAttributeValue):
        return att_value.assessment_result.assessment_project.assessment_profile.maturity_levels.count()