from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response


from assessment.models import AssessmentResult, AssessmentProject, Color
from ..serializers.commonserializers import ColorSerilizer, AssessmentResultSerilizer
from baseinfo.models import MetricCategory
from account.models import Space



class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerilizer


class BreadcrumbInformationView(APIView):
    def post(self, request):
        space_id = request.data.get('space_id')
        assessment_id = request.data.get('assessment_id')
        category_id = request.data.get('category_id')
        content = {}
        if space_id:
            self.extract_space_title(space_id, content)
        if assessment_id:
            self.extract_assessment_title(assessment_id, content)
        if category_id:
            self.extract_category_title(category_id, content)
        return Response(content)

    def extract_category_title(self, category_id, content):
        try:
            category = MetricCategory.objects.get(id = category_id)
            content['category'] = category.title
        except MetricCategory.DoesNotExist:
            content['category'] = ""

    def extract_assessment_title(self, assessment_id, content):
        try:
            assessment = AssessmentProject.objects.get(id = assessment_id)
            content['assessment'] = assessment.title
        except AssessmentProject.DoesNotExist:
            content['assessment'] = ""

    def extract_space_title(self, space_id, content):
        try:
            space = Space.objects.get(id = space_id)
            content['space'] = space.title
        except Space.DoesNotExist:
            content['space'] = ""
    

