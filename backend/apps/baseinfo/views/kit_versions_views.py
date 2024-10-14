from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from baseinfo.services import kit_versions_services


class KitVersionSubjectApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={200: ""})
    def post(self, request, kit_version_id):
        result = kit_versions_services.create_subject_kit_version(request, kit_version_id)
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
