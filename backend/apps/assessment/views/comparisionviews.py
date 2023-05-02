from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from account.permission.spaceperm import ASSESSMENT_LIST_IDS_PARAM_NAME, IsSpaceMember
from assessment.fixture.dictionary import Dictionary
from assessment.services import compareservices, assessmentprojectservices

class CompareAssessmentView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def post(self, request):
        assessment_list_ids = request.data.get(ASSESSMENT_LIST_IDS_PARAM_NAME)
        assessment_projects = assessmentprojectservices.extract_assessments(assessment_list_ids)
        validation_result = compareservices.validate_assessment_compare(assessment_projects)
        if not validation_result.success:
            return Response({'message': validation_result.message}, status=status.HTTP_400_BAD_REQUEST)

        base_infos = []
        for assessment_project in assessment_projects:
            base_info_result = compareservices.extract_base_info(assessment_project)
            base_infos.append(base_info_result.data)

        overall_insight_result = compareservices.extract_overall_insight(assessment_projects)
        
        profile = assessment_projects[0].assessment_profile
        subjects_report_result = compareservices.extract_subject_report(profile, assessment_projects)

        content = Dictionary()
        content.add('base_infos', base_infos)
        content.add('overall_insights', overall_insight_result.data)
        content.add('subjects', subjects_report_result.data)
        
        return Response(content)
