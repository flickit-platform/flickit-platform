from django.db import transaction
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from rest_framework import serializers
from account.serializers.userserializers import UserSimpleSerializer

from ..models.profilemodels import ExpertGroup, ExpertGroupAccess
from ..serializers.commonserializers import AssessmentProfileSimpleSerilizer
from ..services import expertgroupservice
from account.services import userservices


class ExpertGroupSerilizer(serializers.ModelSerializer):
    users = UserSimpleSerializer(many=True)
    profiles = AssessmentProfileSimpleSerilizer(many=True)
    number_of_members = serializers.SerializerMethodField()
    number_of_profiles = serializers.SerializerMethodField()
    owner = UserSimpleSerializer()

    def get_number_of_members(self, expert_group: ExpertGroup):
        return expert_group.users.count()
    
    def get_number_of_profiles(self, expert_group: ExpertGroup):
        return expert_group.profiles.count()
    
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'about', 'bio', 'website', 'picture', 'users',
        'number_of_members', 'profiles', 'number_of_profiles', 'owner']


class ExpertGroupSimpleSerilizer(serializers.ModelSerializer):
    owner = UserSimpleSerializer()
    
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'owner']


class ExpertGroupAccessSerializer(serializers.ModelSerializer):
    expert_group = ExpertGroupSimpleSerilizer()
    user = UserSimpleSerializer()
    class Meta:
        model = ExpertGroupAccess
        fields = ['id', 'user', 'expert_group', 'invite_email', 'invite_expiration_date']

class ExpertGroupGiveAccessSerializer(serializers.Serializer):
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
        expertgroupservice.add_expert_group_coordinator(expert_group, current_user)
        return expert_group

    def validate_website(self, website):
        if not website.startswith("http://") and not website.startswith("https://"):
            if "." not in website:
                raise ValidationError("Invalid URL")
            website = "http://" + website
        try:
            URLValidator(schemes=['http', 'https'])(website)
            return website
        except ValidationError:
            raise ValidationError("Invalid URL")

    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'bio', 'about', 'website', 'picture']
