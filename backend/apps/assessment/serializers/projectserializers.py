from django.utils.text import slugify 
from rest_framework import serializers

from baseinfo.serializers.commonserializers import AssessmentProfileSimpleSerilizer
from baseinfo.serializers.profileserializers import MaturityLevelSimpleSerializer

from account.serializers.spaceserializers import SpaceSimpleSerializer

from assessment.services.metricstatistic import extract_total_progress
from assessment.models import AssessmentProject, AssessmentResult
from assessment.serializers.commonserializers import ColorSerilizer

class AssessmentProjectListSerilizer(serializers.ModelSerializer):
    assessment_profile = AssessmentProfileSimpleSerilizer()
    id = serializers.UUIDField(read_only=True)
    color = ColorSerilizer()
    maturity_level = serializers.SerializerMethodField()
    maturity_level_number = serializers.SerializerMethodField()

    def get_maturity_level_number(self, project: AssessmentProject):
        return project.assessment_profile.maturity_levels.count()
    
    def get_maturity_level(self, project: AssessmentProject):
        return MaturityLevelSimpleSerializer(project.maturity_level).data
    
        
    class Meta:
        model = AssessmentProject
        fields = ['id', 'code', 'title', 'assessment_profile', 'last_modification_date', 'status', 'color', 'assessment_results', 'maturity_level', 'maturity_level_number']

class AssessmentProjecCreateSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = AssessmentProject
        fields = ['id', 'title', 'color', 'space', 'assessment_profile']

    def save(self, **kwargs):
        validated_data = self.validated_data
        validated_data['code'] = slugify(validated_data['title'])
        project  = super().save(**kwargs)
        if not AssessmentResult.objects.filter(assessment_project_id = project .id).exists():
            AssessmentResult.objects.create(assessment_project_id = project .id)

class AssessmentProjectCompareSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    color = ColorSerilizer()
    space = SpaceSimpleSerializer()
    assessment_profile = AssessmentProfileSimpleSerilizer()
    total_progress = serializers.SerializerMethodField()

    def get_maturity_level_number(self, project: AssessmentProject):
        return project.assessment_profile.maturity_levels.count()
    
    def get_maturity_level(self, project: AssessmentProject):
        return MaturityLevelSimpleSerializer(project.maturity_level).data
    

    def get_total_progress(self, project: AssessmentProject):
        return extract_total_progress(project.get_assessment_result())
    class Meta:
        model = AssessmentProject
        fields = ['id', 'code', 'title', 'assessment_profile', 'last_modification_date', 'status', 'color', 'assessment_results', 'space', 'total_progress', 'maturity_level', 'maturity_level_number']


class AssessmentProjectSimpleSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    color = ColorSerilizer()
    space = SpaceSimpleSerializer()
    assessment_profile = AssessmentProfileSimpleSerilizer()
    maturity_level = serializers.SerializerMethodField()
    maturity_level_number = serializers.SerializerMethodField()

    def get_maturity_level_number(self, project: AssessmentProject):
        return project.assessment_profile.maturity_levels.count()
    
    def get_maturity_level(self, project: AssessmentProject):
        return MaturityLevelSimpleSerializer(project.maturity_level).data

    class Meta:
        model = AssessmentProject
        fields = ['id', 'code', 'title', 'assessment_profile', 'last_modification_date', 'status', 'color', 'space', 'maturity_level', 'maturity_level_number']

