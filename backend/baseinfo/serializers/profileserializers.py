from rest_framework import serializers
from ..models import AssessmentProfile, ProfileDsl
from ..imagecomponent.serializers import ProfileImageSerializer
from ..serializers.commonserializers import MetricCategorySerilizer, AssessmentSubjectSerilizer

class ProfileDslSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileDsl
        fields = ['id', 'dsl_file']

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

