from rest_framework import serializers
from django.db.models import F, Prefetch

from baseinfo.models.basemodels import AssessmentSubject, QualityAttribute, Questionnaire
from baseinfo.models.questionmodels import AnswerTemplate, Question, QuestionImpact, OptionValue
from baseinfo.models.assessmentkitmodels import AssessmentKit, ExpertGroup, MaturityLevel
from baseinfo.services import commonservice


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'index']


class QuestionnaireBySubjectSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'code', 'title', 'total_question', 'index']

    total_question = serializers.SerializerMethodField()

    def get_total_question(self, questionnaire: Questionnaire):
        questions = Questionnaire.objects.get(pk=questionnaire.id).question_set.all()
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
        fields = ['id', 'weight']


class LoadAssessmentSubjectAndQualityAttributeSerilizer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    quality_attributes = LoadQualityAttributeSerilizer(many=True)

    class Meta:
        model = AssessmentSubject
        fields = ['id', 'quality_attributes']


class LoadQuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = '__all__'


class SimpleLoadQuestionImpactSerilizer(serializers.ModelSerializer):
    class Meta:
        model = QuestionImpact
        fields = ['id', 'weight', 'maturity_level_id', 'quality_attribute_id']


class SimpleLoadQuestionsSerilizer(serializers.ModelSerializer):
    question_impacts = SimpleLoadQuestionImpactSerilizer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_impacts']


class SimpleLoadOptionValueSerilizer(serializers.ModelSerializer):
    value = serializers.DecimalField(max_digits=3, decimal_places=2)
    question_impact = SimpleLoadQuestionImpactSerilizer()

    class Meta:
        model = OptionValue
        fields = ['id', 'value', 'question_impact']


class LoadAnswerOptionWithlistidSerilizer(serializers.ModelSerializer):
    answer_option_impacts = SimpleLoadOptionValueSerilizer(many=True, source="option_values")

    class Meta:
        model = AnswerTemplate
        fields = ['id', 'question_id', 'answer_option_impacts']


class SimpleLoadAttributesForAssessmentSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityAttribute
        fields = ['id', 'index', 'title']


class LoadAssessmentSubjectsSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    attributes = serializers.SerializerMethodField()

    def get_attributes(self, subject: AssessmentSubject):
        subjects = subject.quality_attributes.order_by('index')
        return SimpleLoadAttributesForAssessmentSubjectSerializer(subjects, many=True).data

    def get_questions_count(self, subject: AssessmentSubject):
        return Question.objects.filter(quality_attributes__assessment_subject=subject.id).distinct().count()

    class Meta:
        model = AssessmentSubject
        fields = ['questions_count', 'description', 'attributes']


class LoadQualityAttributesDetailsSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    questions_on_levels = serializers.SerializerMethodField()

    def get_questions_count(self, attribute: QualityAttribute):
        return Question.objects.filter(question_impacts__quality_attribute=attribute.id).distinct().count()

    def get_questions_on_levels(self, attribute: QualityAttribute):
        maturity_levels = MaturityLevel.objects.filter(
            assessment_kit=attribute.assessment_subject.assessment_kit.id).order_by('value')
        return commonservice.get_maturity_level_details(maturity_levels, attribute.id)

    class Meta:
        model = QualityAttribute
        fields = ['id', 'index', 'title', 'questions_count', 'weight', 'description', 'questions_on_levels']


class LoadQuestionDetailsDetailsSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    attribute_impacts = serializers.SerializerMethodField()

    def get_options(self, question: Question):
        return question.answer_templates.values('index', title=F('caption'))

    def get_attribute_impacts(self, question: Question):
        attribute = QualityAttribute.objects.prefetch_related(Prefetch('question_impacts'),
                                                              Prefetch('question_impacts__option_values'),
                                                              Prefetch('question_impacts__quality_attribute')).filter(
            question_impacts__question=question.id).distinct()
        return commonservice.get_question_impacts_for_questionnaire(question.id, attribute)

    class Meta:
        model = Question
        fields = ['options', 'attribute_impacts']


class SimpleLoadQuestionForQuestionnairesDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'title', 'index', 'may_not_be_applicable']


class LoadQuestionnairesDetailsSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='question_set.count')
    related_subject = serializers.SerializerMethodField()
    questions = SimpleLoadQuestionForQuestionnairesDetailsSerializer(source='question_set', many=True)

    def get_related_subject(self, questionnaire: Questionnaire):
        return questionnaire.assessment_subjects.values_list('title', flat=True)

    class Meta:
        model = Questionnaire
        fields = ['questions_count', 'related_subject', 'description', 'questions']


class LoadOptionDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='option.id')
    index = serializers.IntegerField(source='option.index')

    class Meta:
        model = OptionValue
        fields = ['id', 'index', 'value']
