from rest_framework import serializers
from baseinfo.models.questionmodels import Question


class AnswerQuestionSerializer(serializers.Serializer):
    questionnaire_id = serializers.IntegerField(required=True)
    question_id = serializers.IntegerField(required=True)
    answer_option_id = serializers.IntegerField(required=True, allow_null=True)
    confidence_level_id = serializers.IntegerField(required=True, allow_null=True)
    is_not_applicable = serializers.BooleanField(required=False)

    def validate(self, data):
        if data["answer_option_id"] is not None and data["confidence_level_id"] is None:
            raise serializers.ValidationError('The confidence level must not be null. ')
        return data


