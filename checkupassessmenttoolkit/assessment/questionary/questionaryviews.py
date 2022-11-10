
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..permissions import IsSpaceMember
from ..models import AssessmentProject
from ..report.categoryreport import CategoryReportInfo



class QuestionaryView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get (self, request, assessment_project_id):
        assessment_project = AssessmentProject.objects.get(id = assessment_project_id)
        metric_categories = assessment_project.assessment_profile.metric_categories.all()
        category_report_info = self.extract_category_info(assessment_project.get_assessment_result().id, metric_categories)
        content = {}
        content['metric_categories_info'] = category_report_info.metric_categories_info
        return Response(content)

    def extract_category_info(self, result_id, metric_categories):
        category_report_info = CategoryReportInfo(metric_categories)
        category_report_info.calculate_category_info(result_id)
        return category_report_info