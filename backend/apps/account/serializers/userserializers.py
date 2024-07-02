from django.db import transaction
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer
from django.core.files.storage import default_storage

from account.models import UserAccess, User
from account.serializers.commonserializers import UserSimpleSerializer, SpaceSerializer
from account.serializers.spaceserializers import SpaceSimpleSerializer
from baseinfo.models.assessmentkitmodels import ExpertGroup


class ExpertGroupSimpleSerializers(serializers.ModelSerializer):
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'bio', 'about']


class UserCustomSerializer(BaseUserSerializer):
    spaces = SpaceSerializer(many=True)
    expert_groups = ExpertGroupSimpleSerializers(many=True)
    is_expert = serializers.SerializerMethodField(method_name='has_expet_access')
    picture = serializers.SerializerMethodField()

    def get_picture(self, user: User):
        if user.picture.name == "" or user.picture.name is None:
            return None
        path = user.picture.name
        bucket = path.split('/')[0]
        picture_path = path.replace(bucket + '/', '')
        return default_storage.url(name=picture_path, bucket_name=bucket)

    def has_expet_access(self, user: User):
        return user.has_perm('baseinfo.manage_expert_group')

    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'display_name', 'spaces', 'is_active',
                  'expert_groups', 'is_expert', 'bio', 'picture', 'linkedin']


class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'email', 'password',
                  'email', 'display_name']

    @transaction.atomic
    def perform_create(self, validated_data):
        user = super().perform_create(validated_data)
        return user


class UserSerializer(BaseUserSerializer):
    @transaction.atomic
    def update(self, user, validated_data):
        User.objects.filter(id=user.id).update(**validated_data)
        user_updated = User.objects.get(id=user.id)

        if 'picture' in validated_data:
            user_updated.picture = validated_data['picture']
            user_updated.save()
            user_updated.picture = "media/" + user_updated.picture.name
            user_updated.save()
        picture_path = user_updated.picture.name
        user_updated.picture.name = picture_path.replace("media/", '')
        return user_updated

    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'email', 'display_name', 'bio', 'picture', 'linkedin']

