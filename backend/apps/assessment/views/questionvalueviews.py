from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from common.abstractservices import load_model

from account.permission.spaceperm import IsSpaceMember
from baseinfo.models.basemodels import Questionnaire

from assessment.models import QuestionValue, AssessmentProject
from assessment.serializers.questionvalueserializers import AddQuestionValueSerializer, QuestionValueSerializer
from assessment.serializers import questionvalueserializers
from assessment.services import questionstatistic, questionservices, assessment_core, assessment_core_services


class QuestionValueViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_field = ['question__questionnaire']
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddQuestionValueSerializer
        return QuestionValueSerializer

    def get_queryset(self):
        query_set = QuestionValue.objects.filter(
            assessment_result_id=self.kwargs['assessment_result_pk']).select_related('question')
        if ('questionnaire_pk' in self.request.query_params):
            return query_set.filter(question__questionnaire_id=self.request.query_params.get('questionnaire_pk'))
        return query_set

    def get_serializer_context(self):
        return {'assessment_result_id': self.kwargs['assessment_result_pk'], 'request': self.request}


class TotalProgressView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get(self, request, assessment_project_id):
        assessment_project = AssessmentProject.objects.get(id=assessment_project_id)
        content = {}
        content['total_progress'] = questionstatistic.extract_total_progress(assessment_project.get_assessment_result())
        content['assessment_project_title'] = assessment_project.title
        return Response(content)


class QuestionValueListView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get(self, request, assessment_project_id, questionnaire_id):
        questionnaire = load_model(Questionnaire, questionnaire_id)
        assessment = load_model(AssessmentProject, assessment_project_id)
        content = {}
        question_values = assessment.get_assessment_result().question_values.all()
        questions = questionservices.extract_questions(questionnaire, question_values)
        content['questions'] = questions
        content['assessment_result_id'] = assessment.get_assessment_result().id
        return Response(content)


class AnswerQuestionApi(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = questionvalueserializers.AnswerQuestionSerializer

    @swagger_auto_schema(request_body=serializer_class, responses={201: ""})
    def put(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        serializer_data = self.serializer_class(data=request.data)
        serializer_data.is_valid(raise_exception=True)
        result = assessment_core.question_answering(assessments_details=assessments_details["body"],
                                                    serializer_data=serializer_data.validated_data)
        return Response(result["body"], result["status_code"])


class MaturityLevelCalculateApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: ""})
    def post(self, request, assessment_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_maturity_level_calculate(assessments_details["body"])
        return Response(result["body"], result["status_code"])


class LoadQuestionnaireAnswerApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: ""})
    def get(self, request, assessment_id, questionnaire_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_questionnaire_answer(request, assessments_details["body"], questionnaire_id)
        return Response(result["body"], result["status_code"])


