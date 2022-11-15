from rest_framework.mixins import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from statistics import mean

from assessment.report.subjectreportserializers import SubjectReportSerializer
from assessment.models import QualityAttributeValue
from assessment.models import AssessmentResult
from assessmentbaseinfo.models import AssessmentSubject
from assessmentbaseinfo.models import QualityAttribute

from ..permissions import IsSpaceMember
from .categoryreport import CategoryReportInfo
from ..common import *
from ..assessmentcommon import *

class SubjectReportViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def list(self, request, *args, **kwargs): 
        result_id = self.request.query_params.get('assessment_result_pk')
        subject_id = self.request.query_params.get('assessment_subject_pk')
        # TODO validate url parametrs in middle-ware
        if self.is_subject_report_param_valid(result_id, subject_id) != True :
            return Response({"message": "The requested is not valid"}, status=status.HTTP_404_NOT_FOUND)

        response = super().list(request, *args, **kwargs)
        quality_attribute_values = response.data['results']
        return self.calculate_report(response, quality_attribute_values)

    def is_subject_report_param_valid(self, result_id, subject_id):
        try:
            AssessmentSubject.objects.get(id=subject_id)
            AssessmentResult.objects.get(id=result_id)
            return True
        except AssessmentSubject.DoesNotExist:
            return False

    def calculate_report(self, response, quality_attribute_values):
        result = self.extract_assessment_result()
        metric_categories = self.extract_category_from_assessment_result(result)
        self.extract_base_info(response, result)
        category_report_info = self.extract_category_info(response, metric_categories)
        response.data['total_metric_number'] = category_report_info.total_metric_number
        response.data['total_answered_metric'] = category_report_info.total_answered_metric
        self.calculate_subject_progress(response, category_report_info)

        self.calculate_total_progress(response, result)
        
        if category_report_info.total_answered_metric <= ANSWERED_QUESTION_NUMBER_BOUNDARY:
            response.data['status'] = 'Not Calculated'
            response.data['no_insight_yet_message'] = 'For insight views, you must answer more metrics'
            response.data['results'] = None
        else:
            self.extract_report_details(response, quality_attribute_values)
        return response

    def extract_assessment_result(self):
        return AssessmentResult.objects.filter(pk=self.request.query_params.get('assessment_result_pk')).first()

    def extract_category_from_assessment_result(self, result):
        return result.assessment_project.assessment_profile.metric_categories\
            .filter(assessment_subjects__id = self.request.query_params.get('assessment_subject_pk')).all()

    def extract_base_info(self, response, result):
        response.data['assessment_project_title'] = result.assessment_project.title
        response.data['assessment_project_id'] = result.assessment_project_id
        response.data['assessment_profile_description'] = result.assessment_project.assessment_profile.description

        if result.assessment_project.color is not None :
            response.data['assessment_project_color_code'] = result.assessment_project.color.color_code   
        if result.assessment_project.space is not None:
            response.data['assessment_project_space_id'] = result.assessment_project.space_id
            response.data['assessment_project_space_title'] = result.assessment_project.space.title
        response.data['title'] = AssessmentSubject.objects.get(pk=self.request.query_params.get('assessment_subject_pk')).title

    def extract_report_details(self, response, quality_attribute_values):
        if not quality_attribute_values:
            response.data['status'] = 'Not Calculated'
        else:
            value = self.calculate_maturity_level_value(quality_attribute_values)
            response.data['status'] = calculate_staus(value)
            response.data['maturity_level_value'] = value
            response.data['most_significant_strength_atts'] = self.extract_most_significant_strength_atts(quality_attribute_values)
            response.data['most_significant_weaknessness_atts'] = self.extract_most_significant_weaknessness_atts(quality_attribute_values)

    def calculate_maturity_level_value(self, quality_attribute_values):
        return round(mean([item['maturity_level_value'] for item in quality_attribute_values]))

    def extract_most_significant_weaknessness_atts(self, quality_attribute_values):
        return [o['quality_attribute'] for o in quality_attribute_values  if o['maturity_level_value'] < 3][:-3:-1]

    def extract_most_significant_strength_atts(self, quality_attribute_values):
        return [o['quality_attribute'] for o in quality_attribute_values if o['maturity_level_value'] > 2][:2]

    def calculate_subject_progress(self, response, category_report_info):
        if category_report_info.total_metric_number != 0:
            response.data['progress'] = int((response.data['total_answered_metric'] / response.data['total_metric_number']) * 100)
        else:
            response.data['progress'] = 0

    def calculate_total_progress(self, response, result: AssessmentResult):
        response.data['total_progress'] = extract_total_progress(result)

    def extract_category_info(self, response, metric_categories):
        category_report_info = CategoryReportInfo(metric_categories)
        category_report_info.calculate_category_info(self.request.query_params.get('assessment_result_pk'))
        # response.data['metric_categories_info'] = category_report_info.metric_categories_info
        return category_report_info

    def get_serializer_class(self):
        return SubjectReportSerializer

    def get_queryset(self):
        result_id = self.request.query_params.get('assessment_result_pk')
        if self.is_qulaity_attribute_value_exists(result_id) == False:
            self.init_quality_attribute_value(result_id)

        query_set = QualityAttributeValue.objects.all()

        # filter attribute report by given subject
        # TODO make subject in query-param required and validate it
        if('assessment_subject_pk' in self.request.query_params):
            subject_id = self.request.query_params.get('assessment_subject_pk')
            return query_set.filter(quality_attribute__assessment_subject_id = subject_id) \
                            .filter(assessment_result_id = result_id) \
                            .order_by('-maturity_level_value')
        return query_set

    def is_qulaity_attribute_value_exists(self, result_id):
        return QualityAttributeValue.objects.filter(assessment_result_id = result_id).exists()

    def init_quality_attribute_value(self, result_id):
        quality_attributes = QualityAttribute.objects.all()
        for att in quality_attributes:
            try:
                QualityAttributeValue.objects.get(assessment_result_id = result_id, quality_attribute_id = att.id)
            except QualityAttributeValue.DoesNotExist:
                QualityAttributeValue.objects.create(assessment_result_id = result_id, quality_attribute_id = att.id, maturity_level_value = 1)