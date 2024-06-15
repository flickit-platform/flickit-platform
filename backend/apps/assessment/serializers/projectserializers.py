from rest_framework import serializers
from baseinfo.models.basemodels import Questionnaire


class AssessmentProjectSerializer(serializers.Serializer):
    space_id = serializers.IntegerField(required=True)
    assessment_kit_id = serializers.IntegerField(required=True)
    title = serializers.CharField(required=True)
    color_id = serializers.IntegerField(required=True)


class EditAssessmentSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    color_id = serializers.IntegerField(required=True)
