from rest_framework import serializers
from ..models import AssessmentProfile, ProfileDsl
from ..imagecomponent.serializers import ProfileImageSerializer
from ..serializers.commonserializers import MetricCategorySerilizer, AssessmentSubjectSerilizer

class ProfileDslSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        profile_id = self.context['profile_id']
        try:
            profile_dsl = ProfileDsl.objects.get(profile_id=profile_id)
            profile_dsl.dsl = validated_data['dsl']
            profile_dsl.save()
            return profile_dsl
        except ProfileDsl.DoesNotExist:
            return ProfileDsl.objects.create(profile_id=profile_id, **validated_data)

    def update(self, instance, validated_data):
        profile_id = self.context['profile_id']
        return ProfileDsl.objects.update(profile_id=profile_id, **validated_data)

    class Meta:
        model = ProfileDsl
        fields = ['id', 'dsl']

class AssessmentProfileSerilizer(serializers.ModelSerializer):
    images = ProfileImageSerializer(many=True)
    metric_categories = MetricCategorySerilizer(many=True)
    assessment_subjects = AssessmentSubjectSerilizer(many=True)
    dsl = ProfileDslSerializer()
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'metric_categories', 'assessment_subjects', 'description', 'images', 'dsl']

class AssessmentProfileCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id']

class AssessmentProfileSimpleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentProfile
        fields = ['id', 'code', 'title', 'description']

