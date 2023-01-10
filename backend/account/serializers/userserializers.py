from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserCreatePasswordRetypeSerializer 
from ..models import UserAccess
from .commonserializers import UserSimpleSerializer, SpaceSerializer
from  baseinfo.serializers.commonserializers import ExpertGroupSimpleSerilizers



class UserAccessSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only = True)
    class Meta:
        model = UserAccess
        fields = ['id', 'user', 'space']


class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'password',
                  'email', 'first_name', 'last_name']

class UserSerializer(BaseUserSerializer):
    current_space = SpaceSerializer()
    spaces = SpaceSerializer(many = True)
    expert_groups = ExpertGroupSimpleSerilizers(many = True)
    class Meta(BaseUserSerializer.Meta):
        fields= ['id', 'username', 'email', 'first_name', 'last_name', 'current_space', 'spaces', 'is_active' , 'expert_groups']


