from django.db.models.functions import TruncTime
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework.pagination import PageNumberPagination
from baseinfo import services
from drf_yasg import openapi

from baseinfo.services import commonservice, assessmentkitservice
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.questionmodels import Question, OptionValue
from baseinfo.serializers import commonserializers
from baseinfo.permissions import IsMemberExpertGroup, IsOwnerExpertGroup


class QuestionnaireViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireSerializer

    def get_queryset(self):
        return Questionnaire.objects.all()


class QuestionViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionSerilizer

    def get_queryset(self):
        return Question.objects.filter(questionnaire_id=self.kwargs['questionnaire_pk']).order_by('index')


class QuestionnaireBySubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireBySubjectSerilizer

    def get_queryset(self):
        return Questionnaire.objects.prefetch_related('assessment_subjects').filter(
            assessment_subjects__id=self.kwargs['assessment_subject_pk']).order_by('index')


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all().order_by('index')


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = commonserializers.QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']).order_by(
                'index');
        else:
            return QualityAttribute.objects.all().order_by('index')


class LoadOptionValueInternalApi(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: commonserializers.OptionValueSerilizers(many=True)})
    def get(self, request, answer_tamplate_id):
        option_value = commonservice.get_option_value_with_answer_tamplate(answer_tamplate_id)
        response = commonserializers.OptionValueSerilizers(option_value, many=True, ).data
        return Response({'items': response}, status=status.HTTP_200_OK)


class LoadQuestionInternalApi(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: commonserializers.SimpleQuestionSerializers(many=True)})
    def get(self, request, quality_attribute_id):
        question = commonservice.get_question_with_quality_attribute(quality_attribute_id)
        response = commonserializers.SimpleQuestionSerializers(question, many=True).data
        return Response({'items': response}, status=status.HTTP_200_OK)


class LoadQualityAttributeInternalApi(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: commonserializers.LoadQualityAttributeSerilizer(many=True)})
    def get(self, request, assessment_subject_id):
        quality_attribute = commonservice.get_quality_attribute_with_assessment_subject(assessment_subject_id)
        response = commonserializers.LoadQualityAttributeSerilizer(quality_attribute, many=True).data
        return Response({'items': response}, status=status.HTTP_200_OK)


class LoadQuestionImpactInternalApi(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(responses={200: commonserializers.LoadQuestionImpactSerilizer(many=True)})
    def get(self, request, question_impact_id):
        question_impact = commonservice.get_question_impact_with_id(question_impact_id)
        response = commonserializers.LoadQuestionImpactSerilizer(question_impact, many=True).data
        return Response({'items': response}, status=status.HTTP_200_OK)


class CustomPaginationForQuestions(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 10000

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'items': data
        })


class LoadQuestionsInternalApi(APIView):
    permission_classes = [AllowAny]
    pagination_class = CustomPaginationForQuestions

    @swagger_auto_schema(responses={200: commonserializers.SimpleLoadQuestionsSerilizer(many=True)})
    def get(self, request, assessment_kit_id):
        paginator = self.pagination_class()
        question = commonservice.get_questions_with_assessmnet_kit_id(assessment_kit_id)
        if question == False:
            return Response({"code": "NOT_FOUND", 'message': "'assessment_kit_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        paginated_queryset = paginator.paginate_queryset(question, request)
        response = commonserializers.SimpleLoadQuestionsSerilizer(paginated_queryset, many=True).data
        return paginator.get_paginated_response(response)


test_param = openapi.Parameter('ids', openapi.IN_QUERY, description="test manual param", type=openapi.TYPE_ARRAY,
                               items=openapi.Items(type=openapi.TYPE_NUMBER))


class LoadAnswerOptionWithlistIdInternalApi(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(manual_parameters=[test_param],
                         responses={200: commonserializers.LoadAnswerOptionWithlistidSerilizer(many=True)})
    def get(self, request):
        if "ids" in request.query_params:
            answers_option = commonservice.get_answer_option_whit_id(request.query_params['ids'])
            response = commonserializers.LoadAnswerOptionWithlistidSerilizer(answers_option, many=True).data
            return Response({'items': response}, status=status.HTTP_200_OK)
        return Response({'items': []}, status=status.HTTP_200_OK)


class LoadAssessmentSubjectDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    @swagger_auto_schema(responses={200: commonserializers.LoadAssessmentSubjectsSerializer(many=True)})
    def get(self, request, assessment_kit_id, subject_id):
        subject = commonservice.check_subject_in_assessment_kit(assessment_kit_id, subject_id)
        if not subject:
            return Response({"code": "NOT_FOUND", 'message': "'subject_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = commonserializers.LoadAssessmentSubjectsSerializer(subject).data
        return Response(response, status=status.HTTP_200_OK)


class LoadQualityAttributesDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    @swagger_auto_schema(responses={200: commonserializers.LoadQualityAttributesDetailsSerializer(many=True)})
    def get(self, request, assessment_kit_id, attribute_id):
        attribute = commonservice.check_attributes_in_assessment_kit(assessment_kit_id, attribute_id)
        if not attribute:
            return Response({"code": "NOT_FOUND", 'message': "'attribute_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = commonserializers.LoadQualityAttributesDetailsSerializer(attribute).data
        return Response(response, status=status.HTTP_200_OK)


class LoadMaturityLevelsDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    def get(self, request, assessment_kit_id, attribute_id, maturity_level_id):
        attribute = commonservice.check_attributes_in_assessment_kit(assessment_kit_id, attribute_id)
        if not attribute:
            return Response({"code": "NOT_FOUND", 'message': "'attribute_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        maturity_level = commonservice.check_maturity_level_in_assessment_kit(assessment_kit_id, maturity_level_id)
        if not maturity_level:
            return Response({"code": "NOT_FOUND", 'message': "'level_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = commonservice.get_questions_in_maturity_level(maturity_level, attribute_id)
        return Response(response, status=status.HTTP_200_OK)


class LoadQuestionnairesDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    def get(self, request, assessment_kit_id, questionnaire_id):
        questionnaire = commonservice.check_questionnaire_in_assessment_kit(assessment_kit_id, questionnaire_id)
        if not questionnaire:
            return Response({"code": "NOT_FOUND", 'message': "'questionnaire_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = commonserializers.LoadQuestionnairesDetailsSerializer(questionnaire).data
        return Response(response, status=status.HTTP_200_OK)


class LoadQuestionDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    def get(self, request, assessment_kit_id, question_id):
        question = commonservice.check_question_in_assessment_kit(assessment_kit_id, question_id)
        if not question:
            return Response({"code": "NOT_FOUND", 'message': "'question_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = commonserializers.LoadQuestionDetailsDetailsSerializer(question).data
        return Response(response, status=status.HTTP_200_OK)


class LoadQuestionsOfSubjectInternalApi(APIView):
    permission_classes = [AllowAny]

    def get(self, request, subject_id):
        result = commonservice.get_questions_of_a_assessment_subject_id(subject_id)
        return Response(result["body"], result["status_code"])
