


from django.db import transaction
from rest_framework import serializers

from ..services import spaceservices
from ..models import Space
from ..models import User


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
        return spaceservices.add_owner_to_space(space, current_user.id)
    
    class Meta:
        model = Space
        fields = ['id', 'code', 'title', 'owner']

