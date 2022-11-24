from rest_framework.permissions import BasePermission
from assessment.models import AssessmentResult, AssessmentProject


class IsSpaceMember(BasePermission):
    def has_permission(self, request, view):
        current_user = request.user
        current_user_space_list = current_user.spaces.all()
        if view.kwargs.get('space_pk') is not None:
            return self.has_permision_for_assessment(view, current_user_space_list)
            
        if view.kwargs.get('assessment_result_pk') is not None:
            result_id = view.kwargs.get('assessment_result_pk')
            assessment_project = AssessmentResult.objects.get(id = result_id).assessment_project
            return self.has_permision_for_assessment_result(assessment_project, current_user_space_list)

        if view.kwargs.get('assessment_project_id') is not None:
            try:
                assessment_project = AssessmentProject.objects.get(id = view.kwargs.get('assessment_project_id'))
            except AssessmentProject.DoesNotExist:
                return False
            return self.has_permision_for_assessment_result(assessment_project, current_user_space_list)

        if request.query_params.get('assessment_result_pk') is not None:
            assessment_project = AssessmentResult.objects.get(id = request.query_params.get('assessment_result_pk')).assessment_project
            return self.has_permision_for_assessment_result(assessment_project, current_user_space_list)

    def has_permision_for_assessment_result(self, assessment_project, current_user_space_list):
        assessment_list = []
        for space in current_user_space_list:
            assessment_list.extend(space.assessmentproject_set.all()) 
        for assessment in assessment_list:
            if str(assessment_project.id) == str(assessment.id):
                return True
    
    def has_permision_for_assessment(self, view, current_user_space_list):
        for space in current_user_space_list:
                if str(space.id) == view.kwargs.get('space_pk'):
                    return True
    