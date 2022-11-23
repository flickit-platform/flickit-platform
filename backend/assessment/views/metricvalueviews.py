from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from assessment.models import MetricValue, AssessmentProject
from account.permission.spaceperm import IsSpaceMember
from baseinfo.models import MetricCategory
from ..serializers.metricvalueserializers import AddMetricValueSerializer, UpdateMetricValueSerializer, MetricValueSerializer
from ..fixture.dictionary import Dictionary
from ..fixture.metricstatistic import extract_total_progress


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

class TotalProgressView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get (self, request, assessment_project_id):
        assessment_project = AssessmentProject.objects.get(id = assessment_project_id)
        content = {}
        content['total_progress'] = extract_total_progress(assessment_project.get_assessment_result())
        content['assessment_project_title'] = assessment_project.title
        return Response(content)

class MetricValueListView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get (self, request, assessment_project_id, metric_category_id):
        category = MetricCategory.objects.get(id = metric_category_id)
        content = {}
        assessment = AssessmentProject.objects.get(id = assessment_project_id)
        metric_values = assessment.get_assessment_result().metric_values.all()
        metrics = self.extract_metrics(category, metric_values)
        content['metrics'] = metrics
        content['assessment_result_id'] = assessment.get_assessment_result().id

        return Response(content)

    # TODO: Find a better way for serilizing -> pickle or serilizer.data MetricSerilizer
    def extract_metrics(self, category, metric_values):
        metrics = []
        metric_query_set = category.metric_set.all().order_by('index')
        for item in metric_query_set:
            metric = Dictionary()
            metric.add('id', item.id)
            metric.add('title', item.title)
            metric.add('index', item.index)
            answer_templates = []
            for answer in item.answer_templates.all():
                answer_template = Dictionary()
                answer_template.add('id', answer.id)
                answer_template.add('caption', answer.caption)
                answer_template.add('value', answer.value)
                answer_templates.append(answer_template)
                metric.add('answer_templates', answer_templates)
            for value in metric_values:
                if value.answer is not None and value.metric.id == item.id:
                    answer = Dictionary()
                    answer.add('id', value.answer.id)
                    answer.add('caption', value.answer.caption)
                    answer.add('value', value.answer.value)
                    metric.add('answer', answer)
                    break
            metrics.append(metric)
        return metrics