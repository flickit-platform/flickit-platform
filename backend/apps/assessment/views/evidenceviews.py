from django.db import transaction
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from assessment.serializers import evidence_serializers
from assessment.services import evidence_services, assessment_core_services


class EvidencesApi(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = evidence_serializers.AddEvidenceSerializer

    @swagger_auto_schema(request_body=serializer_class, responses={201: ""})
    def post(self, request):
        serializer_data = self.serializer_class(data=request.data)
        serializer_data.is_valid(raise_exception=True)
        assessments_details = assessment_core_services.load_assessment_details_with_id(request,
                                                                                       serializer_data.validated_data[
                                                                                           'assessment_id'])
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = evidence_services.add_evidences(assessments_details["body"], serializer_data.validated_data,
                                                 request.user.id,
                                                 authorization_header=request.headers['Authorization'],
                                                 )
        return Response(result["body"], result["status_code"])

    def get(self, request):
        if "assessment_id" not in request.query_params:
            return Response({"code": "INVALID_INPUT", "message": "'assessment_id' may not be empty"},
                            status.HTTP_400_BAD_REQUEST)
        if "question_id" not in request.query_params:
            return Response({"code": "INVALID_INPUT", "message": "'question_id' may not be empty"},
                            status.HTTP_400_BAD_REQUEST)
        assessment_id = request.query_params["assessment_id"]
        question_id = request.query_params["question_id"]
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = evidence_services.get_list_evidences(assessments_details["body"], question_id, request)
        return Response(result["body"], result["status_code"])


class EvidenceApi(APIView):
    @swagger_auto_schema(request_body=evidence_serializers.EditEvidenceSerializer(), responses={201: ""})
    def put(self, request, evidence_id):
        serializer_data = evidence_serializers.EditEvidenceSerializer(data=request.data)
        serializer_data.is_valid(raise_exception=True)
        result = evidence_services.edit_evidence(serializer_data.validated_data, evidence_id,
                                                 authorization_header=request.headers['Authorization'],
                                                 )
        return Response(result["body"], result["status_code"])

    def delete(self, request, evidence_id):
        result = evidence_services.delete_evidence(evidence_id)
        return Response(status=result["status_code"])

