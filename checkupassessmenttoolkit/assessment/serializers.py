from rest_framework import serializers

from assessmentbaseinfo.serializers import AssessmentProfileSerilizer
from assessmentbaseinfo.serializers import QualityAttributeSerilizer
from .common import *
from .models import AssessmentProject, AssessmentResult, Color, QualityAttributeValue


class ColorSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = Color
        fields = ['id', 'title', 'color_code']


class AssessmentProjectListSerilizer(serializers.ModelSerializer):
    assessment_profile = AssessmentProfileSerilizer()
    id = serializers.UUIDField(read_only=True)
    color = ColorSerilizer()
    class Meta:
        model = AssessmentProject
        fields = ['id', 'code', 'title', 'assessment_profile', 'last_modification_date', 'status', 'color', 'assessment_results']

class AssessmentProjecCreateSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = AssessmentProject
        fields = ['id', 'title', 'color', 'space']


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