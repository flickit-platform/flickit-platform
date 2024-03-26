from rest_framework import serializers


class InviteUserWithEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)