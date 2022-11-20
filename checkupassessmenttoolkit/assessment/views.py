from rest_framework.viewsets import ModelViewSet

from assessment.models import AssessmentResult
from .serializers import ColorSerilizer, AssessmentResultSerilizer
from .models import Color



class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerilizer
    

