from django.db import transaction
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer 

from .models import Space, UserAccess, User


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class SpaceSerializer(serializers.ModelSerializer):
    owner = UserSimpleSerializer(read_only=True)
    @transaction.atomic
    def save(self, **kwargs):
        space = super().save(**kwargs)
        current_user = self.context.get('request', None).user
        try:
            user_access = UserAccess.objects.get(space_id = space.id, user_id = current_user.id)
            user_access.save()
        except UserAccess.DoesNotExist:
            user_access = UserAccess.objects.create(user_id = current_user.id, space_id = space.id)
            user_access.save()
        
        space.owner_id = current_user.id
        space.save()
        return space
    
    class Meta:
        model = Space
        fields = ['id', 'code', 'title', 'owner']

class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name']

class UserSerializer(BaseUserSerializer):
    current_space = SpaceSerializer()
    spaces = SpaceSerializer(many = True)
    class Meta(BaseUserSerializer.Meta):
        fields= ['id', 'username', 'email', 'first_name', 'last_name', 'current_space', 'spaces', 'is_active']

class UserAccessSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only = True)
    class Meta:
        model = UserAccess
        fields = ['id', 'user', 'space']

class SpaceListSerializer(serializers.ModelSerializer):
    owner = UserSimpleSerializer()
    members_number = serializers.IntegerField(source='users.count', read_only=True)
    class Meta:
        model = Space
        fields = ['id', 'code', 'title', 'last_modification_date', 'owner', 'members_number'] 

class SpaceSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ['id', 'code', 'title'] 

class AddSpaceAccessToUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.EmailField()
    def validate_user_id(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('No user with the given email was found.')
        return value

    def save(self, **kwargs):
        space_id = self.context['space_id']
        user = User.objects.get(email = self.validated_data['user_id'])
        user_id = user.id
        if not user.is_active:
            raise serializers.ValidationError('This user is not active')
        try:
            user_access = UserAccess.objects.get(space_id = space_id, user_id = user_id)
            user_access.save()
            self.instance = user_access
        except UserAccess.DoesNotExist:
            self.instance = UserAccess.objects.create(user_id = user_id, space_id = space_id)
        return self.instance

    class Meta:
        model = UserAccess
        fields = ['id', 'user_id']




