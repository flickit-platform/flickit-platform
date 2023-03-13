from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response

from assessment.models import AssessmentResult, Color
from assessment.services import commonservices
from assessment.serializers.commonserializers import ColorSerilizer, AssessmentResultSerilizer

class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerilizer

class BreadcrumbInformationView(APIView):
    def post(self, request):
        content = commonservices.loadBreadcrumbInfo(request.data)
        return Response(content)

    

