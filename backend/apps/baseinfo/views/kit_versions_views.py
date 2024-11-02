from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import kit_versions_services


class KitVersionsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, kit_version_id):
        result = kit_versions_services.load_kit_with_version_id(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class KitVersionSubjectsApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_subject_kit_version(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])

    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, kit_version_id):
        result = kit_versions_services.get_subjects_list(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class KitVersionSubjectApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, subject_id):
        result = kit_versions_services.update_subject(request, kit_version_id,
                                                      subject_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, subject_id):
        result = kit_versions_services.delete_subject_with_kit_version_id(request, kit_version_id,
                                                                          subject_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class SubjectChangeOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id):
        result = kit_versions_services.change_subject_order(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class KitVersionMaturityLevelsApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_maturity_levels_with_kit_version(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])

    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, kit_version_id):
        result = kit_versions_services.get_maturity_levels_with_kit_version(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class KitVersionMaturityLevelApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, maturity_level_id):
        result = kit_versions_services.update_maturity_level_with_kit_version(request, kit_version_id,
                                                                              maturity_level_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, maturity_level_id):
        result = kit_versions_services.delete_maturity_level_with_kit_version(request, kit_version_id,
                                                                              maturity_level_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class MaturityLevelsChangeOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id):
        result = kit_versions_services.change_maturity_levels_order(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class LevelCompetencesApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_level_competence(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, kit_version_id):
        result = kit_versions_services.get_level_competences_list(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class LevelCompetenceApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, level_competence_id):
        result = kit_versions_services.update_level_competence(request, kit_version_id, level_competence_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, level_competence_id):
        result = kit_versions_services.delete_level_competence(request, kit_version_id, level_competence_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class KitActiveApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, kit_version_id):
        result = kit_versions_services.kit_active(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class AttributesApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_attribute(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])

    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, kit_version_id):
        result = kit_versions_services.get_attributes_list(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class AttributeApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, attribute_id):
        result = kit_versions_services.update_attribute(request, kit_version_id, attribute_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, attribute_id):
        result = kit_versions_services.delete_attribute(request, kit_version_id, attribute_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class AttributeChangeOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id):
        result = kit_versions_services.change_attribute_order(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class QuestionnairesApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_questionnaire(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])

    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[size_param, page_param])
    def get(self, request, kit_version_id):
        result = kit_versions_services.get_questionnaires_list(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class QuestionnaireApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, questionnaire_id):
        result = kit_versions_services.update_questionnaire(request, kit_version_id, questionnaire_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, questionnaire_id):
        result = kit_versions_services.delete_questionnaire(request, kit_version_id, questionnaire_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class QuestionnaireChangeOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id):
        result = kit_versions_services.change_questionnaire_order(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class QuestionsApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_question(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])


class QuestionApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id, question_id):
        result = kit_versions_services.update_question(request, kit_version_id, question_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])

    def delete(self, request, kit_version_id, questionnaire_id):
        result = kit_versions_services.delete_question(request, kit_version_id, questionnaire_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class QuestionsChangeOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def put(self, request, kit_version_id):
        result = kit_versions_services.change_questions_order(request, kit_version_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class QuestionImpactsApi(APIView):
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_question_impact(request, kit_version_id)
        return Response(data=result["body"], status=result["status_code"])
