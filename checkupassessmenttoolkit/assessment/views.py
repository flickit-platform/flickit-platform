from rest_framework.viewsets import ModelViewSet
from assessment.models import AssessmentProject, AssessmentResult, MetricValue
from assessment.serializers import AddMetricValueSerializer, AssessmentProjecCreateSerilizer, AssessmentProjectListSerilizer, AssessmentResultSerilizer, MetricValueSerializer, UpdateMetricValueSerializer, QualityAttributeValueSerializer
from rest_framework.mixins import *

from assessmentbaseinfo.models import MetricCategory
from .serializers import AddQualityAttributeValueSerializer, ColorSerilizer
from .models import Color, QualityAttributeValue
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
class AssessmentProjectViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return AssessmentProjecCreateSerilizer   
        else:
            return AssessmentProjectListSerilizer

    def get_queryset(self):
        # current_user = self.request.user
        # assessements = []
        # if current_user.spaces is not None:
        #     for space in current_user.spaces:
        #         assessements.append(space.assessment_set.all())
        #         return assessements
        return AssessmentProject.objects.all()



class AssessmentProjectBySpaceViewSet(ModelViewSet):
    def get_serializer_class(self):
        return AssessmentProjectListSerilizer
    def list(self, request, *args, **kwargs):
        current_user = self.request.user
        space_list = current_user.spaces.all()
        for space in space_list:
            if str(space.id) == self.kwargs['space_pk']:
                response = super().list(request, *args, **kwargs)
                response.data['requested_space'] = space.title
                return response
        return Response({'message': "You don't have permission to access this page"}, status=status.HTTP_404_NOT_FOUND)
    def retrieve(self, request, *args, **kwargs):
        current_user = self.request.user
        space_list = current_user.spaces.all()
        for space in space_list:
            if str(space.id) == self.kwargs['space_pk']:
                response = super().retrieve(request, *args, **kwargs)
                response.data['requested_space'] = space.title
                return response
        return Response({'message': "You don't have permission to access this page"}, status=status.HTTP_404_NOT_FOUND)

    def get_queryset(self):
        # current_user = self.request.user
        # space_list = current_user.spaces.all()
        # for space in space_list:
        #     if str(space.id) == self.kwargs['space_pk']:
        return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk'])
        # return AssessmentProject.objects.none()
        # return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk'])



class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerilizer
    

class MetricValueViewSet(ModelViewSet):
    # http_method_names = ['get', 'post', 'patch', 'delete']
    filter_backends = [DjangoFilterBackend,SearchFilter]
    search_field = ['metric__metric_category']

    def retrieve(self, request, *args, **kwargs):
        result_id = self.kwargs['assessment_result_pk']
        assessment_project = AssessmentResult.objects.get(id = result_id).assessment_project
        current_user = self.request.user
        space_list = current_user.spaces.all()
        assessment_list = []
        for space in space_list:
            assessment_list.extend(space.assessmentproject_set.all()) 
        for assessment in assessment_list:
            if str(assessment_project.id) == str(assessment.id):
                return super().retrieve(request, *args, **kwargs)
        return Response({"message": "You don't have permision to visit this report"}, status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        result_id = self.kwargs['assessment_result_pk']
        assessment_project = AssessmentResult.objects.get(id = result_id).assessment_project
        current_user = self.request.user
        space_list = current_user.spaces.all()
        assessment_list = []
        for space in space_list:
            assessment_list.extend(space.assessmentproject_set.all()) 
        for assessment in assessment_list:
            if str(assessment_project.id) == str(assessment.id):
                return super().list(request, *args, **kwargs)
        return Response({"message": "You don't have permision to visit this report"}, status=status.HTTP_404_NOT_FOUND)
        

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddMetricValueSerializer
        elif self.request.method == 'PATCH':
            return UpdateMetricValueSerializer
        return MetricValueSerializer
    
    def get_queryset(self):
        query_set = MetricValue.objects.filter(assessment_result_id = self.kwargs['assessment_result_pk']).select_related('metric')
        if('metric_category_pk' in self.request.query_params):
            return query_set.filter(metric__metric_category_id = self.request.query_params.get('metric_category_pk'))
        return query_set

    def get_serializer_context(self):
        return {'assessment_result_id': self.kwargs['assessment_result_pk']}


class QualityAttributeViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddQualityAttributeValueSerializer
        # elif self.request.method == 'PATCH':
        #     return UpdateMetricValueSerializer
        return QualityAttributeValueSerializer
    def get_queryset(self):
        return QualityAttributeValue.objects.filter(assessment_result_id = self.kwargs['assessment_result_pk']).select_related('quality_attribute')
       

    def get_serializer_context(self):
        return {'assessment_result_id': self.kwargs['assessment_result_pk']}