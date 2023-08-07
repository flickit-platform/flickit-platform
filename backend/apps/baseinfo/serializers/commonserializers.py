from rest_framework import serializers

from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute, Questionnaire
from baseinfo.models.questionmodels import AnswerTemplate, Question, QuestionImpact, OptionValue
from baseinfo.models.assessmentkitmodels import AssessmentKit, ExpertGroup

class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'index']


class QuestionnaireBySubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'total_question', 'index']
    total_question = serializers.SerializerMethodField()

    def get_total_question(self, questionnaire:Questionnaire):
        questions = Questionnaire.objects.get(pk = questionnaire.id).question_set.all()
        return len(questions)


class AssessmentSubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentSubject
        fields = ['id', 'code', 'title', 'description', 'index']


class QuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = ['id', 'level', 'quality_attribute']


class QualityAttributeSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id', 'code', 'title', 'description', 'index']

class AnswerTemplateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = AnswerTemplate
        fields = ['id', 'caption', 'value', 'index']

class SimpleQuestionSerializers(serializers.ModelSerializer):
    quality_attributes = QualityAttributeSerilizer(many=True)
    question_impacts = QuestionImpactSerilizer(many=True)
    class Meta:
        model = Question
        fields = ['id', 'title', 'index', 'quality_attributes', 'question_impacts']

class QuestionSerilizer(serializers.ModelSerializer):
    answer_templates = AnswerTemplateSerializer(many=True)
    class Meta:
        model = Question
        fields = ['id', 'title', 'index', 'answer_templates']

class AssessmentKitSimpleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKit
        fields = ['id', 'code', 'title', 'summary']

class ExpertGroupSimpleSerilizers(serializers.ModelSerializer):
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'bio', 'about']

class OptionValueSerilizers(serializers.ModelSerializer):
    class Meta:
        model = OptionValue
        fields = ['id', 'option_id', 'value', 'question_impact_id']     


class LoadQualityAttributeSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id',  'weight']

class LoadAssessmentSubjectAndQualityAttributeSerilizer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    quality_attributes = LoadQualityAttributeSerilizer(many=True)
    class Meta:
        model = AssessmentSubject
        fields = ['id','quality_attributes']
        

class LoadQuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = '__all__'

class SimpleLoadQuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = ['id','weight','maturity_level_id','quality_attribute_id']

class SimpleLoadQuestionsSerilizer(serializers.ModelSerializer):
    question_impacts = SimpleLoadQuestionImpactSerilizer(many=True)
    class Meta:
        model = Question
        fields = ['id','question_impacts']