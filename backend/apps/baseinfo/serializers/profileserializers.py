from rest_framework import serializers

from assessment.models import AssessmentProject

from baseinfo.models.profilemodels import AssessmentProfile, ProfileDsl, ProfileTag, MaturityLevel
from baseinfo.models.basemodels import AssessmentSubject
from baseinfo.serializers.commonserializers import ExpertGroupSimpleSerilizers

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
    tags =  ProfileTagSerializer(many = True)
    expert_group = ExpertGroupSimpleSerilizers()
    number_of_assessment = serializers.SerializerMethodField()
    current_user_delete_permission = serializers.SerializerMethodField()
    current_user_is_coordinator = serializers.SerializerMethodField()
    number_of_subject = serializers.SerializerMethodField()
    number_of_questionaries = serializers.SerializerMethodField()
    subjects_with_desc = serializers.SerializerMethodField()
    questionnaires = serializers.SerializerMethodField()
    likes_number = serializers.SerializerMethodField()


    def get_number_of_assessment(self, profile: AssessmentProfile):
        return AssessmentProject.objects.filter(assessment_profile_id = profile.id).count()

    def get_current_user_delete_permission(self, profile: AssessmentProfile):
        return profileservice.get_current_user_delete_permission(profile, self.context.get('request', None).user.id)

    def get_current_user_is_coordinator(self, profile: AssessmentProfile):
        return profileservice.get_current_user_is_coordinator(profile, self.context.get('request', None).user.id)

    def get_number_of_subject(self, profile: AssessmentProfile):
        return profile.assessment_subjects.all().count()

    def get_number_of_questionaries(self, profile: AssessmentProfile):
        return profile.questionnaires.all().count()

    def get_subjects_with_desc(self, profile: AssessmentProfile):
        subjects = profile.assessment_subjects.values('id', 'title', 'description')
        for subject in subjects:
            subj_qs = AssessmentSubject.objects.get(id = subject['id'])
            attributes = subj_qs.quality_attributes.values('id', 'title', 'description')
            subject['attributes'] = attributes
        return subjects

    def get_questionnaires(self, profile: AssessmentProfile):
        return profile.questionnaires.values('id', 'title', 'description')

    def get_likes_number(self, profile: AssessmentProfile):
        return profile.likes.count()
    
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'summary', 'about', 'tags', 'expert_group', 
        'creation_time', 'last_modification_date', 'likes_number', 'number_of_subject', 'number_of_questionaries',
        'number_of_assessment', 'current_user_delete_permission', 'is_active', 'current_user_is_coordinator', 
        'subjects_with_desc', 'questionnaires']

class AssessmentProfileCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id']

class ImportProfileSerializer(serializers.Serializer):
    # code = serializers.CharField()
    title = serializers.CharField()
    about = serializers.CharField()
    summary = serializers.CharField()
    tag_ids = serializers.ListField(child=serializers.IntegerField())
    expert_group_id = serializers.IntegerField()
    dsl_id = serializers.IntegerField()

class ProfileInitFormSerilizer(serializers.ModelSerializer):
    tags =  ProfileTagSerializer(many = True)
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'title', 'summary', 'about', 'tags']

class UpdateProfileSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    about = serializers.CharField(required=False)
    summary = serializers.CharField(required=False)
    tags = serializers.ListField(child=serializers.IntegerField(),required=False)


class MaturityLevelSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaturityLevel
        fields = ['id', 'title', 'value']



