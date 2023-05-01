from django.db import transaction
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from assessment.models import Evidence, EvidenceRelation
from account.serializers.commonserializers import UserSimpleSerializer


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
    def post(self, request, metric_id, assessment_id):
        evidence_relation = None
        try:
            evidence_relation = EvidenceRelation.objects.get(metric_id = metric_id, assessment_id = assessment_id)
        except EvidenceRelation.DoesNotExist:
            evidence_relation = EvidenceRelation.objects.create(metric_id = metric_id, assessment_id = assessment_id)

        evidence_relation.assessment_id = assessment_id
        evidence_relation.metric_id = metric_id
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
    def get (self, request, metric_id, assessment_id):
        content = {}
        content['evidences'] = []
        try:
            evidence_relation = EvidenceRelation.objects.get(assessment_id = assessment_id, metric_id = metric_id)
        except EvidenceRelation.DoesNotExist:
            return Response(content)
        
        if evidence_relation is None:
            return Response(content)
        evidence_qs = Evidence.objects.filter(evidence_relation_id = evidence_relation.id).order_by('-creation_time')
        content['evidences'] = EvidenceSerializer(list(evidence_qs), many=True).data
        return Response(content)