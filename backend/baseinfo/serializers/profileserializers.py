from rest_framework import serializers
from ..models.profilemodels import AssessmentProfile, ProfileDsl, ProfileTag
from ..imagecomponent.serializers import ProfileImageSerializer
from .commonserializers import ExpertGroupSimpleSerilizers
from assessment.models import AssessmentProject
from ..services import profileservice


class ProfileDslSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileDsl
        fields = ['id', 'dsl_file']

class ProfileTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileTag
        fields = ['id', 'code', 'title']

class AssessmentProfileSerilizer(serializers.ModelSerializer):
    images = ProfileImageSerializer(many=True)
    tags =  ProfileTagSerializer(many = True)
    expert_group = ExpertGroupSimpleSerilizers()
    number_of_assessment = serializers.SerializerMethodField()
    current_user_delete_permission = serializers.SerializerMethodField()
    current_user_is_coordinator = serializers.SerializerMethodField()
    number_of_subject = serializers.SerializerMethodField()
    number_of_questionaries = serializers.SerializerMethodField()

    def get_number_of_assessment(self, profile: AssessmentProfile):
        return AssessmentProject.objects.filter(assessment_profile_id = profile.id).count()

    def get_current_user_delete_permission(self, profile: AssessmentProfile):
        return profileservice.get_current_user_delete_permission(profile, self.context.get('request', None).user.id)

    def get_current_user_is_coordinator(self, profile: AssessmentProfile):
        return profileservice.get_current_user_is_coordinator(profile, self.context.get('request', None).user.id)

    def get_number_of_subject(self, profile: AssessmentProfile):
        return profile.assessment_subjects.all().count()

    def get_number_of_questionaries(self, profile: AssessmentProfile):
        return profile.metric_categories.all().count()
    
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'summary', 'about', 'images', 'tags', 'expert_group', 
        'creation_time', 'last_modification_date', 'likes', 'number_of_subject', 'number_of_questionaries',
        'number_of_assessment', 'current_user_delete_permission', 'is_active', 'current_user_is_coordinator']

class AssessmentProfileCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id']


class ImportProfileSerializer(serializers.Serializer):
    tag_ids = serializers.ListField(child=serializers.IntegerField())
    expert_group_id = serializers.IntegerField()
    dsl_id = serializers.IntegerField()
    




