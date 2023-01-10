


from django.db import transaction
from rest_framework import serializers

from ..models import Space, UserAccess
from ..models import UserAccess, User




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

