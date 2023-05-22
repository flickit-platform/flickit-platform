from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from common.abstractservices import load_model
from account.permission.spaceperm import IsSpaceMember

from assessment.models import AssessmentResult, AssessmentProject
from assessment.serializers.reportserilaizers import AssessmentReportSerilizer

class AssessmentReportViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'assessment_project_id'
    permission_classes = [IsAuthenticated, IsSpaceMember]
    
    def get_serializer_class(self):
        return AssessmentReportSerilizer

    def get_queryset(self):
        return AssessmentResult.objects.all()


class AssessmentCheckReportApi(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, assessment_project_id):
        assessment = load_model(AssessmentProject, assessment_project_id)
        if assessment.maturity_level is None:
            return Response({'report_available': False}, status=status.HTTP_200_OK)
        else:
            return Response({'report_available': True}, status=status.HTTP_200_OK)
        
