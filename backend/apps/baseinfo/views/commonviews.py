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
