from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from assessment.models import Evidence


class AddEvidenceApi(APIView):
    @transaction.atomic
    def post(self, request, metric_value_id):
        evidence = Evidence()
        evidence.created_by = self.request.user
        evidence.description = request.data.get('description')
        evidence.metric_value_id = metric_value_id
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