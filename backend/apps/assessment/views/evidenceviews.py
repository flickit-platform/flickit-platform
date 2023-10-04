from django.db import transaction
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from assessment.models import Evidence, EvidenceRelation
from account.serializers.commonserializers import UserSimpleSerializer
from assessment.serializers import evidence_serializers
from assessment.services import evidence_services, assessment_core_services


class EvidenceSerializer(serializers.ModelSerializer):
    created_by = UserSimpleSerializer()
    class Meta:
        model = Evidence
        fields = ['id', 'description', 'created_by', 'creation_time', 'last_modification_date']

class EvidenceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = ['id', 'description']

class AddEvidenceApi(APIView):
    @transaction.atomic
    def post(self, request, question_id, assessment_id):
        evidence_relation = None
        try:
            evidence_relation = EvidenceRelation.objects.get(question_id = question_id, assessment_id = assessment_id)
        except EvidenceRelation.DoesNotExist:
            evidence_relation = EvidenceRelation.objects.create(question_id = question_id, assessment_id = assessment_id)

        evidence_relation.assessment_id = assessment_id
        evidence_relation.question_id = question_id
        evidence_relation.save()

        evidence = Evidence()
        evidence.created_by = self.request.user
        evidence.description = request.data.get('description')
        evidence.evidence_relation = evidence_relation
        evidence.save()
        return Response()
    
class EvidenceUpdateAPI(APIView):
    def put(self, request, pk):
        try:
            evidence = Evidence.objects.get(pk=pk)
            evidence.description=request.data['description']
            evidence.save()
            return Response()
        except Evidence.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class EvidenceDeleteAPI(APIView):
    def delete(self, request, pk):
        try:
            instance = Evidence.objects.get(pk=pk)
        except Evidence.DoesNotExist:
            return Response({'message': 'The Evidence does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response({'message': 'Evidence deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
class EvidenceListApi(APIView):
    def get (self, request, question_id, assessment_id):
        content = {}
        content['evidences'] = []
        try:
            evidence_relation = EvidenceRelation.objects.get(assessment_id = assessment_id, question_id = question_id)
        except EvidenceRelation.DoesNotExist:
            return Response(content)
        
        if evidence_relation is None:
            return Response(content)
        evidence_qs = Evidence.objects.filter(evidence_relation_id = evidence_relation.id).order_by('-creation_time')
        content['evidences'] = EvidenceSerializer(list(evidence_qs), many=True).data
        return Response(content)


class EvidencesApi(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = evidence_serializers.AddEvidenceSerializer

    @swagger_auto_schema(request_body=serializer_class, responses={201: ""})
    def post(self, request):
        serializer_data = self.serializer_class(data=request.data)
        serializer_data.is_valid(raise_exception=True)
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, serializer_data.validated_data['assessment_id'])
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = evidence_services.add_evidences(assessments_details["body"], serializer_data.validated_data, request.user.id)
        return Response(result["body"], result["status_code"])


class ListEvidencesApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id, question_id):
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = evidence_services.get_list_evidences(assessments_details["body"], question_id, request)
        return Response(result["body"], result["status_code"])
