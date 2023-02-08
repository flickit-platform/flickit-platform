from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response

from account.models import Space
from baseinfo.models.basemodels import Questionnaire

from assessment.models import AssessmentResult, AssessmentProject, Color
from assessment.serializers.commonserializers import ColorSerilizer, AssessmentResultSerilizer

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
        questionnaire_id = request.data.get('questionnaire_id')
        content = {}
        if space_id:
            self.extract_space_title(space_id, content)
        if assessment_id:
            self.extract_assessment_title(assessment_id, content)
        if questionnaire_id:
            self.extract_questionnaire_title(questionnaire_id, content)
        return Response(content)

    def extract_questionnaire_title(self, questionnaire_id, content):
        try:
            questionnaire = Questionnaire.objects.get(id = questionnaire_id)
            content['questionnaire'] = questionnaire.title
        except Questionnaire.DoesNotExist:
            content['questionnaire'] = ""

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
    

