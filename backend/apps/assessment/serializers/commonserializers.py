from rest_framework import serializers

from baseinfo.serializers.commonserializers import QualityAttributeSerilizer
from baseinfo.serializers.assessmentkitserializers import MaturityLevelSimpleSerializer

from assessment.models import AssessmentResult, Color, QualityAttributeValue


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
    maturity_level = MaturityLevelSimpleSerializer()
    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'maturity_level_value', 'assessment_result', 'quality_attribute', 'maturity_level']


class AddEvidenceSerializer(serializers.Serializer):
    assessment_id = serializers.UUIDField(required=True)
    question_id = serializers.IntegerField(required=True)
    description = serializers.CharField(required=True, min_length=3, max_length=1000)