from rest_framework import serializers
from django.db.models import F, Prefetch

from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute, Questionnaire
from baseinfo.models.questionmodels import AnswerTemplate, Question, QuestionImpact, OptionValue
from baseinfo.models.assessmentkitmodels import AssessmentKit, ExpertGroup, MaturityLevel
from baseinfo.services import commonservice


class QuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = ['id', 'quality_attribute']


class QualityAttributeSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id', 'code', 'title', 'description', 'index']


class AnswerTemplateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = AnswerTemplate
        fields = ['id', 'caption', 'index']


class SimpleQuestionSerializers(serializers.ModelSerializer):
    quality_attributes = QualityAttributeSerilizer(many=True)
    question_impacts = QuestionImpactSerilizer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'title', 'index', 'quality_attributes', 'question_impacts']


class AssessmentKitSimpleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKit
        fields = ['id', 'code', 'title', 'summary']


class SimpleLoadQuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = ['id', 'weight', 'maturity_level_id', 'quality_attribute_id']


class SimpleLoadOptionValueSerilizer(serializers.ModelSerializer):
    value = serializers.DecimalField(max_digits=3, decimal_places=2)
    question_impact = SimpleLoadQuestionImpactSerilizer()

    class Meta:
        model = OptionValue
        fields = ['id', 'value', 'question_impact']





class LoadOptionDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='option.id')
    index = serializers.IntegerField(source='option.index')

    class Meta:
        model = OptionValue
        fields = ['id', 'index', 'value']
