from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from account.permission.spaceperm import IsSpaceMember
from assessment.models import AssessmentResult
from assessment.serializers.reportserilaizers import AssessmentReportSerilizer

class AssessmentReportViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'assessment_project_id'
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get_serializer_class(self):
        return AssessmentReportSerilizer

    def get_queryset(self):
        return AssessmentResult.objects.all()