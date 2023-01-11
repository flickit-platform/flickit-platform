from django.db import transaction
from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer 
from ..models import UserAccess
from .commonserializers import UserSimpleSerializer, SpaceSerializer
from  baseinfo.serializers.commonserializers import ExpertGroupSimpleSerilizers
from ..services import spaceservices



class UserAccessSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only = True)
    class Meta:
        model = UserAccess
        fields = ['id', 'user', 'space']


class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name']
    
    @transaction.atomic
    def perform_create(self, validated_data):
        user =  super().perform_create(validated_data)
        spaceservices.add_invited_user_to_space(user)
        return user

class UserSerializer(BaseUserSerializer):
    current_space = SpaceSerializer()
    spaces = SpaceSerializer(many = True)
    expert_groups = ExpertGroupSimpleSerilizers(many = True)
    class Meta(BaseUserSerializer.Meta):
        fields= ['id', 'username', 'email', 'first_name', 'last_name', 'current_space', 'spaces', 'is_active' , 'expert_groups']


