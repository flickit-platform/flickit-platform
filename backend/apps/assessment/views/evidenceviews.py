from django.db import transaction
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from assessment.services import evidence_services, assessment_core_services


class EvidencesApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def post(self, request):
        result = evidence_services.add_evidences(request)
        return Response(data=result["body"], status=result["status_code"])

    assessment_id = openapi.Parameter('assessmentId', openapi.IN_QUERY, description="assessmentId param",
                                      type=openapi.TYPE_STRING, required=True)
    question_id = openapi.Parameter('questionId', openapi.IN_QUERY, description="questionId param",
                                    type=openapi.TYPE_INTEGER, required=True)
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[assessment_id, question_id, size_param, page_param])
    def get(self, request):
        result = evidence_services.get_list_evidences(request)
        return Response(data=result["body"], status=result["status_code"])


class EvidenceApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, evidence_id):
        result = evidence_services.evidence_get_by_id(request, evidence_id)
        return Response(data=result["body"], status=result["status_code"])

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT), responses={201: ""})
    def put(self, request, evidence_id):
        result = evidence_services.edit_evidence(request, evidence_id)
        return Response(data=result["body"], status=result["status_code"])

    @swagger_auto_schema(responses={204: ""})
    def delete(self, request, evidence_id):
        result = evidence_services.delete_evidence(request, evidence_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class EvidenceAttachmentsApi(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    attachment_param = openapi.Parameter('attachment', openapi.IN_FORM, description="attachment file",
                                         type=openapi.TYPE_FILE, required=True)
    description_param = openapi.Parameter('description', openapi.IN_FORM, description="description",
                                          type=openapi.TYPE_STRING, required=False)

    @swagger_auto_schema(manual_parameters=[attachment_param, description_param], responses={201: ""})
    def post(self, request, evidence_id):
        result = evidence_services.evidence_add_attachments(request, evidence_id)
        return Response(data=result["body"], status=result["status_code"])

    def get(self, request, evidence_id):
        result = evidence_services.evidence_list_attachments(request, evidence_id)
        return Response(data=result["body"], status=result["status_code"])


class EvidenceAttachmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, evidence_id, attachment_id):
        result = evidence_services.evidence_delete_attachment(request, evidence_id, attachment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
