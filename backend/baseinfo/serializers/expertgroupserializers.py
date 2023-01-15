from django.db import transaction

from rest_framework import serializers
from account.serializers.userserializers import UserSimpleSerializer

from ..models.profilemodels import ExpertGroup
from ..serializers.commonserializers import AssessmentProfileSimpleSerilizer
from ..services import expertgroupservice
from account.services import userservices


class ExpertGroupSerilizer(serializers.ModelSerializer):
    users = UserSimpleSerializer(many=True)
    profiles = AssessmentProfileSimpleSerilizer(many=True)
    number_of_members = serializers.SerializerMethodField()
    number_of_profiles = serializers.SerializerMethodField()

    def get_number_of_members(self, expert_group: ExpertGroup):
        return expert_group.users.count()
    
    def get_number_of_profiles(self, expert_group: ExpertGroup):
        return expert_group.profiles.count()
    
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture', 'users','number_of_members', 'profiles', 'number_of_profiles']


class ExpertGroupAccessSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate(self, attrs):
        user = userservices.load_user_by_email(attrs['email'])
        if user is None:
            error_message = 'user with email {} is not found'.format(attrs['email'])
            raise serializers.ValidationError({'message': error_message})
        return attrs


class ExpertGroupCreateSerilizers(serializers.ModelSerializer):

    @transaction.atomic
    def save(self, **kwargs):
        expert_group = super().save(**kwargs)
        current_user = self.context.get('request', None).user
        return expertgroupservice.add_expert_group_coordinator(expert_group, current_user)

    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture']
