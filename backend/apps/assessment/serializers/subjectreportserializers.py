from rest_framework import serializers

from assessment.models import QualityAttributeValue
from assessment.serializers.commonserializers import QualityAttributeSerilizer
from assessment.fixture.common import calculate_staus

class SubjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'status', 'quality_attribute', 'maturity_level_value']

    quality_attribute = QualityAttributeSerilizer()
    status = serializers.SerializerMethodField()

    def get_status(self, att_value : QualityAttributeValue):
        return calculate_staus(att_value.maturity_level_value)