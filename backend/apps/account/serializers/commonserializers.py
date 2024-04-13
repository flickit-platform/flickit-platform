from django.db import transaction
from rest_framework import serializers

from account.services import spaceservices
from account.models import Space
from account.models import User


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'display_name']


class SpaceSerializer(serializers.ModelSerializer):
    owner = UserSimpleSerializer(read_only=True)

    @transaction.atomic
    def create(self, validated_data):
        current_user = self.context.get('request', None).user
        space = Space(**validated_data)
        space.owner = current_user
        space.created_by = current_user
        space.last_modified_by = current_user
        space.save()
        spaceservices.add_owner_to_space(space, current_user.id)
        return space

    class Meta:
        model = Space
        fields = ['id', 'title', 'owner']
