from assessment.models import AssessmentResult
from rest_framework.mixins import *
from assessment.report.reportserilaizers import AssessmentReportSerilizer
from rest_framework import viewsets

class AssessmentReportViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'assessment_project_id'

    def get_serializer_class(self):
        return AssessmentReportSerilizer

    def get_queryset(self):
        current_user = self.request.user
        space_list = current_user.spaces.all()
        assessment_list = []
        for space in space_list:
            assessment_list.extend(space.assessmentproject_set.all()) 
        if 'assessment_project_id' in self.kwargs:
            for assessment in assessment_list:
                if self.kwargs['assessment_project_id'] == str(assessment.id):
                    return AssessmentResult.objects.all()  
        return AssessmentResult.objects.none()
            # for space in space_list:
