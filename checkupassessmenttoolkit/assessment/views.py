from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.mixins import *
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from assessment.models import AssessmentProject, AssessmentResult, MetricValue
from assessment.serializers import *
from assessmentcore.models import Space

from .serializers import ColorSerilizer
from .metricvalue.serializers import *
from .models import Color
from .permissions import IsSpaceMember



class AssessmentProjectViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return AssessmentProjecCreateSerilizer   
        else:
            return AssessmentProjectListSerilizer

    def get_queryset(self):
        return AssessmentProject.objects.all()

class AssessmentProjectBySpaceViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated, IsSpaceMember]
    def get_serializer_class(self):
        return AssessmentProjectListSerilizer

    # TODO: Handle requested space to suitable position
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        requested_space = Space.objects.get(id = self.kwargs['space_pk'])
        if requested_space is not None:
            requested_space = Space.objects.get(id = self.kwargs['space_pk'])
            response.data['requested_space'] = requested_space.title
        return response       

    def get_queryset(self):
        return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk'])



class AssessmentResultRegisterViewSet(ModelViewSet):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerilizer

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerilizer
    

class MetricValueViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend,SearchFilter]
    search_field = ['metric__metric_category']
    permission_classes = [IsAuthenticated, IsSpaceMember]

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
