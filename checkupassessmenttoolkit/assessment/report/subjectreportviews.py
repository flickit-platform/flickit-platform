from rest_framework.mixins import *
from assessment.report.subjectreportserializers import SubjectReportSerializer
from rest_framework import viewsets

from assessment.models import QualityAttributeValue
from assessment.models import AssessmentResult
from statistics import mean
from assessmentbaseinfo.models import AssessmentSubject
from assessmentbaseinfo.models import QualityAttribute
from ..common import *

class CategoryReportInfo():
    def __init__(self, metric_categories):
        self.metric_categories_info = []
        self.metric_categories = metric_categories
        self.total_metric_number = 0
        self.total_answered_metric = 0

    def calculate_category_info(self, assessment_result_pk):
        for category in self.metric_categories:
            metrics = category.metric_set.all()
            answered_metric = 0
            self.total_metric_number += len(metrics)
            for metric in metrics:
                metric_values = metric.metric_values
                for value in metric_values.filter(assessment_result_id=assessment_result_pk):
                    if value.metric_id == metric.id:
                        if value.answer is not None:
                            answered_metric += 1
                            self.total_answered_metric +=1
                        
            category_info = {}
            category_info['metric_number'] = len(metrics)
            category_info['title'] = category.title
            category_info['id'] = category.id
            category_info['answered_metric'] = answered_metric
            if len(metrics) != 0:
                category_info['progress'] = ((answered_metric / len(metrics)) * 100)
            else:
                category_info['progress'] = 0
            self.metric_categories_info.append(category_info)
        # return metric_categories_info


class SubjectReportViewSet(viewsets.ReadOnlyModelViewSet):
    def list(self, request, *args, **kwargs):
        result_id = self.request.query_params.get('assessment_result_pk')
        subject_id = self.request.query_params.get('assessment_subject_pk')
        try:
            AssessmentSubject.objects.get(id=subject_id)
            AssessmentResult.objects.get(id=result_id)
        except AssessmentSubject.DoesNotExist:
            return Response({"message": "The requested is not valid"}, status=status.HTTP_404_NOT_FOUND)

        assessment_project = AssessmentResult.objects.get(id = result_id).assessment_project
        current_user = self.request.user
        space_list = current_user.spaces.all()
        assessment_list = []
        for space in space_list:
            assessment_list.extend(space.assessmentproject_set.all()) 
        for assessment in assessment_list:
            if str(assessment_project.id) == str(assessment.id):
                response = super().list(request, *args, **kwargs)
                quality_attribute_values = response.data['results']
                return self.calculate_report(response, quality_attribute_values)
        return Response({"message": "You don't have permision to visit this report"}, status=status.HTTP_404_NOT_FOUND)

    def calculate_report(self, response, quality_attribute_values):
        result = AssessmentResult.objects.filter(pk=self.request.query_params.get('assessment_result_pk')).first()
        metric_categories = result.assessment_project.assessment_profile.metric_categories\
            .filter(assessment_subjects__id = self.request.query_params.get('assessment_subject_pk')).all()
        self.extract_base_info(response, result)
        category_report_info = self.extract_category_info(response, metric_categories)
        response.data['total_metric_number'] = category_report_info.total_metric_number
        response.data['total_answered_metric'] = category_report_info.total_answered_metric
        self.calculate_progress(response, category_report_info)
        
        if category_report_info.total_answered_metric <= 5:
            response.data['status'] = 'Not Calculated'
            response.data['no_insight_yet_message'] = 'For insight views, you must answer more metrics'
            response.data['results'] = None
        else:
            self.extract_report_details(response, quality_attribute_values)
        
       
        return response

    def extract_report_details(self, response, quality_attribute_values):
        if not quality_attribute_values:
            response.data['status'] = 'Not Calculated'
        else:
            value = round(mean([item['maturity_level_value'] for item in quality_attribute_values]))
            response.data['status'] = calculate_staus(value)
            response.data['maturity_level_value'] = value
            
            response.data['most_significant_strength_atts'] = [o['quality_attribute'] for o in quality_attribute_values if o['maturity_level_value'] > 2][:2]

            response.data['most_significant_weaknessness_atts'] = [o['quality_attribute'] for o in quality_attribute_values  if o['maturity_level_value'] < 3][:-3:-1]

    def calculate_progress(self, response, category_report_info):
        if category_report_info.total_metric_number != 0:
            response.data['progress'] = int((response.data['total_answered_metric'] / response.data['total_metric_number']) * 100)
        else:
            response.data['progress'] = 0

    def extract_category_info(self, response, metric_categories):
        category_report_info = CategoryReportInfo(metric_categories)
        category_report_info.calculate_category_info(self.request.query_params.get('assessment_result_pk'))
        response.data['metric_categories_info'] = category_report_info.metric_categories_info
        return category_report_info

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

    def get_serializer_class(self):
        return SubjectReportSerializer

    def get_queryset(self):
        
        if QualityAttributeValue.objects.filter(assessment_result_id = self.request.query_params.get('assessment_result_pk')).first() is None:
            quality_attributes = QualityAttribute.objects.all()
            for att in quality_attributes:
                try:
                    QualityAttributeValue.objects.get(assessment_result_id = self.request.query_params.get('assessment_result_pk'), quality_attribute_id = att.id)
                except QualityAttributeValue.DoesNotExist:
                    QualityAttributeValue.objects.create(assessment_result_id = self.request.query_params.get('assessment_result_pk'), quality_attribute_id = att.id, maturity_level_value = 1)

        query_set = QualityAttributeValue.objects.all()
        if('assessment_subject_pk' in self.request.query_params):
            return query_set.filter(quality_attribute__assessment_subject_id = self.request.query_params.get('assessment_subject_pk')) \
                            .filter(assessment_result_id = self.request.query_params.get('assessment_result_pk')) \
                            .order_by('-maturity_level_value')
        return query_set