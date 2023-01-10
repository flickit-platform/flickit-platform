
from rest_framework import serializers

from ..models import Space
from ..services import userservices
from .commonserializers import UserSimpleSerializer




class InputSpaceAccessSerializer(serializers.Serializer):
        email = serializers.EmailField()
        def validate(self, attrs):
            print(attrs)
            user = userservices.load_user_by_email(attrs['email'])
            if user is None:
                raise serializers.ValidationError({'message': 'No user with the given email was found.'})
            if not user.is_active:
                raise serializers.ValidationError({'message': 'User with the given email is not active.'})
            return attrs


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
