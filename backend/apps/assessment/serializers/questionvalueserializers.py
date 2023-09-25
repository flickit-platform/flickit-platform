from django.db import transaction
from rest_framework import serializers

from baseinfo.models.questionmodels import Question
from baseinfo.serializers.commonserializers import AnswerTemplateSerializer, SimpleQuestionSerializers

from assessment.models import QuestionValue
from assessment.fixture.common import update_assessment_status
from assessment.services import attributeservices


class QuestionValueSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    answer = AnswerTemplateSerializer()
    question = SimpleQuestionSerializers()

    class Meta:
        model = QuestionValue
        fields = ['id', 'answer', 'assessment_result', 'question']


class AddQuestionValueSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField()
    id = serializers.UUIDField(read_only=True)

    def validate_question_id(self, value):
        if not Question.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Question with the given ID was found.')
        return value

    def validate(self, attrs):
        answer_template = attrs['answer']
        if answer_template is None:
            return attrs
        if attrs['question_id'] != answer_template.question.id:
            raise serializers.ValidationError(
                'The options is invalid')
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        assessment_result_id = self.context['assessment_result_id']
        self.save_question(assessment_result_id)
        assessment_result = self.instance.assessment_result
        question_impacts = self.instance.question.question_impacts.all()
        attributeservices.save_qauality_att_value(question_impacts, assessment_result)
        update_assessment_status(assessment_result)
        return self.instance

    def save_question(self, assessment_result_id):
        question_id = self.validated_data['question_id']
        answer = self.validated_data['answer']
        try:
            question_value = QuestionValue.objects.get(assessment_result_id=assessment_result_id,
                                                       question_id=question_id)
            question_value.answer = answer
            question_value.save()
            self.instance = question_value
        except QuestionValue.DoesNotExist:
            question_value = QuestionValue()
            question_value.assessment_result_id = assessment_result_id
            question_value.answer = answer
            question_value.question_id = question_id
            question_value.save()
            self.instance = question_value
            # self.instance = QuestionValue.objects.create(assessment_result_id=assessment_result_id, **self.validated_data)

    class Meta:
        model = QuestionValue
        fields = ['id', 'answer', 'question_id']


class AnswerQuestionSerializer(serializers.Serializer):
    questionnaire_id = serializers.IntegerField(required=True)
    question_id = serializers.IntegerField(required=True)
    answer_option_id = serializers.IntegerField(required=True)


