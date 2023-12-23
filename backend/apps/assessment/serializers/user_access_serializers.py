from rest_framework import serializers


class AssessmentKitAddUserAccess(serializers.Serializer):
    email = serializers.EmailField(required=True)