from rest_framework.viewsets import ModelViewSet

from assessmentbaseinfo.imagecomponent.serializers import QualityAttributeImageSerializer, ProfileImageSerializer, SubjectImageSerializer
from assessmentbaseinfo.imagecomponent.models import QualityAttributeImage
from assessmentbaseinfo.imagecomponent.models import SubjectImage
from assessmentbaseinfo.imagecomponent.models import ProfileImage

class QualityAttributeImageViewSet(ModelViewSet):
    serializer_class = QualityAttributeImageSerializer

    def get_serializer_context(self):
        return {'attribute_id': self.kwargs['attribute_pk']}

    def get_queryset(self):
        return QualityAttributeImage.objects.filter(attribute_id=self.kwargs['attribute_pk'])

class SubjectImageViewSet(ModelViewSet):
    serializer_class = SubjectImageSerializer

    def get_serializer_context(self):
        return {'subject_id': self.kwargs['subject_pk']}

    def get_queryset(self):
        return SubjectImage.objects.filter(subject_id=self.kwargs['subject_pk'])

class ProfileImageViewSet(ModelViewSet):
    serializer_class = ProfileImageSerializer

    def get_serializer_context(self):
        return {'profile_id': self.kwargs['profile_pk']}

    def get_queryset(self):
        return ProfileImage.objects.filter(profile_id=self.kwargs['profile_pk'])