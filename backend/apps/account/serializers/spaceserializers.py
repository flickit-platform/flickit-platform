
from rest_framework import serializers
from account.models import Space
from account.services import userservices
from account.serializers.commonserializers import UserSimpleSerializer
# from django.db.models.fields import IntegerField

class InputSpaceAccessSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate(self, attrs):
        user = userservices.load_user_by_email(attrs['email'])
        if user is None:
            raise serializers.ValidationError({'message': 'No user with the given email was found.'})
        if not user.is_active:
            raise serializers.ValidationError({'message': 'User with the given email is not active.'})
        return attrs

class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate(self, attrs):
        user = userservices.load_user_by_email(attrs['email'])
        if user is not None:
            raise serializers.ValidationError({'message': 'An account exists with this email'})
        return attrs

class SpaceListSerializer(serializers.ModelSerializer):
    owner = UserSimpleSerializer()
    members_number = serializers.IntegerField(source='users.count', read_only=True)
    assessment_numbers = serializers.IntegerField(source= 'projects.count', read_only = True)

    class Meta:
        model = Space
        fields = ['id', 'code', 'title', 'last_modification_date', 'owner', 'members_number', 'assessment_numbers'] 

class SpaceSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ['id', 'code', 'title'] 
