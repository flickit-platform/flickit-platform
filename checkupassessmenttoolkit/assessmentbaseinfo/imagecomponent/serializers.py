from rest_framework import serializers

from assessmentbaseinfo.imagecomponent.models import QualityAttributeImage, SubjectImage, ProfileImage


class QualityAttributeImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        attribute_id = self.context['attribute_id']
        return QualityAttributeImage.objects.create(attribute_id=attribute_id, **validated_data)

    class Meta:
        model = QualityAttributeImage
        fields = ['id', 'image']

class SubjectImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        subject_id = self.context['subject_id']
        return SubjectImage.objects.create(subject_id=subject_id, **validated_data)

    class Meta:
        model = SubjectImage
        fields = ['id', 'image']

class ProfileImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        profile_id = self.context['profile_id']
        return ProfileImage.objects.create(profile_id=profile_id, **validated_data)

    class Meta:
        model = ProfileImage
        fields = ['id', 'image']