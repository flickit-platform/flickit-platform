from rest_framework import serializers


class AddEvidenceSerializer(serializers.Serializer):
    assessment_id = serializers.UUIDField(required=True)
    question_id = serializers.IntegerField(required=True)
    description = serializers.CharField(required=True, min_length=3, max_length=1000)


class EditEvidenceSerializer(serializers.Serializer):
    description = serializers.CharField(required=True, min_length=3, max_length=1000)