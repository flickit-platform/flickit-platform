from rest_framework import serializers

from baseinfo.serializers.commonserializers import QualityAttributeSerilizer
from ..models import AssessmentResult, Color, QualityAttributeValue


class ColorSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = Color
        fields = ['id', 'title', 'color_code']


class AssessmentResultSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = AssessmentResult
        fields = ['id', 'assessment_project']


class QualityAttributeValueSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    quality_attribute = QualityAttributeSerilizer()
    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'maturity_level_value', 'assessment_result', 'quality_attribute']