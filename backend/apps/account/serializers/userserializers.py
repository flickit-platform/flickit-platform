from django.db import transaction
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer

from account.models import UserAccess, User
from account.serializers.commonserializers import UserSimpleSerializer, SpaceSerializer
from account.serializers.spaceserializers import SpaceSimpleSerializer
from account.services import spaceservices
from baseinfo.models.assessmentkitmodels import ExpertGroup


class ExpertGroupSimpleSerializers(serializers.ModelSerializer):
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'bio', 'about']


class UserCustomSerializer(BaseUserSerializer):
    from baseinfo.serializers import commonserializers
    current_space = SpaceSerializer()
    spaces = SpaceSerializer(many=True)
    expert_groups = ExpertGroupSimpleSerializers(many=True)
    is_expert = serializers.SerializerMethodField(method_name='has_expet_access')

    def has_expet_access(self, user: User):
        return user.has_perm('baseinfo.manage_expert_group')

    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'display_name', 'current_space', 'default_space', 'spaces', 'is_active',
                  'expert_groups', 'is_expert', 'bio', 'picture', 'linkedin']


class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'email', 'password',
                  'email', 'display_name']

    @transaction.atomic
    def perform_create(self, validated_data):
        user = super().perform_create(validated_data)
        spaceservices.create_default_space(user)
        return user


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'display_name', 'bio', 'picture', 'linkedin']


class UserAccessSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    space = SpaceSimpleSerializer()

    class Meta:
        model = UserAccess
        fields = ['id', 'user', 'space', 'invite_email', 'invite_expiration_date']
