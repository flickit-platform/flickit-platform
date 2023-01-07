from django.db import transaction

from rest_framework import serializers
from account.serializers import UserSimpleSerializer

from ..models.profilemodels import ExpertGroup
from ..serializers.profileserializers import AssessmentProfileSimpleSerilizer


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


class ExpertGroupCreateSerilizers(serializers.ModelSerializer):

    @transaction.atomic
    def save(self, **kwargs):
        expert_group = super().save(**kwargs)
        current_user = self.context.get('request', None).user
        expert_group.users.add(current_user)
        expert_group.owner_id = current_user.id
        expert_group.save()
        return expert_group

    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture']
