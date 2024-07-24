from rest_framework import serializers

from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitDsl, AssessmentKitTag, ExpertGroup, \
    MaturityLevel, LevelCompetence
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire
from rest_framework.validators import UniqueValidator

from baseinfo.services import assessmentkitservice


class LoadAssessmentKitDetailsForReportSerializer(serializers.ModelSerializer):
    maturity_level_count = serializers.SerializerMethodField()
    expert_group = serializers.SerializerMethodField()

    def get_expert_group(self, assessment_kit: AssessmentKit):
        expert_group = assessment_kit.expert_group
        return {"id": expert_group.id, "name": expert_group.name}

    def get_maturity_level_count(self, assessment_kit: AssessmentKit):
        return MaturityLevel.objects.filter(kit_version=assessment_kit.kit_version_id).all().count()

    class Meta:
        model = AssessmentKit
        fields = ['id', 'title', 'summary', 'maturity_level_count', 'expert_group']
