from rest_framework import serializers
from ..models.profilemodels import ExpertGroup
from account.serializers import UserSimpleSerializer
from ..serializers.profileserializers import AssessmentProfileSimpleSerilizer




class ExpertGroupSerilizer(serializers.ModelSerializer):
    users = UserSimpleSerializer(many=True)
    profiles = AssessmentProfileSimpleSerilizer(many=True)
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture', 'users', 'profiles']


class ExpertGroupCreateSerilizers(serializers.ModelSerializer):
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture']

class ExpertGroupListSerilizers(serializers.ModelSerializer):
    users = UserSimpleSerializer(many = True)
    profiles = AssessmentProfileSimpleSerilizer(many = True)
    class Meta:
        model = ExpertGroup
        fields = ['id', 'name', 'description', 'website', 'picture', 'users', 'profiles']