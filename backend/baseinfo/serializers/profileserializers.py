from rest_framework import serializers
from ..models.profilemodels import AssessmentProfile, ProfileDsl, ProfileTag
from ..imagecomponent.serializers import ProfileImageSerializer
from .commonserializers import ExpertGroupSimpleSerilizers
from assessment.models import AssessmentProject
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

    def get_number_of_assessment(self, profile: AssessmentProfile):
        return AssessmentProject.objects.filter(assessment_profile_id = profile.id).count()

    def get_current_user_delete_permission(self, profile: AssessmentProfile):
        number_of_assessment = AssessmentProject.objects.filter(assessment_profile_id = profile.id).count()
        if number_of_assessment > 0:
            return False
        if profile.expert_group is not None:
            request = self.context.get('request', None)
            user = profile.expert_group.users.filter(id = request.user.id)
            return user.count() > 0
        return True

    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'summary', 'about', 'images', 'tags', 'expert_group', 'number_of_assessment', 'current_user_delete_permission']

class AssessmentProfileCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id']





