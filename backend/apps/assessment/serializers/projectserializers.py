from rest_framework import serializers
from baseinfo.models.basemodels import Questionnaire


class AssessmentProjectSerializer(serializers.Serializer):
    space_id = serializers.IntegerField(required=True)
    assessment_kit_id = serializers.IntegerField(required=True)
    title = serializers.CharField(required=True)
    color_id = serializers.IntegerField(required=True)


class LoadQuestionnairesSerializer(serializers.ModelSerializer):
    subjects = serializers.SerializerMethodField()
    questions_count = serializers.IntegerField(source="question_set.count")

    def get_subjects(self, questionnaire: Questionnaire):
        return questionnaire.assessment_subjects.values('id', 'title')

    class Meta:
        model = Questionnaire
        fields = ['id', 'index', 'title', 'questions_count', 'subjects']


class EditAssessmentSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    color_id = serializers.IntegerField(required=True)
