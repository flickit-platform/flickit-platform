
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from assessmentbaseinfo.models import QualityAttribute
from ..permissions import IsSpaceMember
from ..models import AssessmentProject, QualityAttributeValue
from ..report.categoryreport import CategoryReportInfo



class QuestionaryView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get (self, request, assessment_project_id):
        assessment_project = AssessmentProject.objects.get(id = assessment_project_id)
        result_id = assessment_project.get_assessment_result().id
        if self.is_qulaity_attribute_value_exists(result_id) == False:
            self.init_quality_attribute_value(result_id)

        
        subject_id = request.query_params.get("subject_pk", None)
        if subject_id:
            metric_categories = assessment_project.assessment_profile.metric_categories.filter(assessment_subjects__id=subject_id)
        else:
            metric_categories = assessment_project.assessment_profile.metric_categories.all()
        category_report_info = self.__extract_category_info(result_id, metric_categories)
        content = {}
        content['questionaries_info'] = category_report_info.metric_categories_info
        content['assessment_title'] = assessment_project.title
        content['subjects'] = assessment_project.assessment_profile.assessment_subjects.values('id','title')
        return Response(content)

    def __extract_category_info(self, result_id, metric_categories):
        category_report_info = CategoryReportInfo(metric_categories)
        category_report_info.calculate_category_info(result_id)
        return category_report_info

    def is_qulaity_attribute_value_exists(self, result_id):
        return QualityAttributeValue.objects.filter(assessment_result_id = result_id).exists()

    def init_quality_attribute_value(self, result_id):
        quality_attributes = QualityAttribute.objects.all()
        for att in quality_attributes:
            try:
                QualityAttributeValue.objects.get(assessment_result_id = result_id, quality_attribute_id = att.id)
            except QualityAttributeValue.DoesNotExist:
                QualityAttributeValue.objects.create(assessment_result_id = result_id, quality_attribute_id = att.id, maturity_level_value = 1)