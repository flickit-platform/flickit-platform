from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from account.permission.spaceperm import IsSpaceMember
from baseinfo.models.basemodels import Questionnaire

from assessment.models import MetricValue, AssessmentProject, Evidence
from assessment.serializers.metricvalueserializers import AddMetricValueSerializer, MetricValueSerializer, EvidenceSerializer
from assessment.fixture.dictionary import Dictionary
from assessment.services.metricstatistic import extract_total_progress


class MetricValueViewSet(ModelViewSet):
    filter_backends = [DjangoFilterBackend,SearchFilter]
    search_field = ['metric__questionnaire']
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddMetricValueSerializer
        return MetricValueSerializer
    
    def get_queryset(self):
        query_set = MetricValue.objects.filter(assessment_result_id = self.kwargs['assessment_result_pk']).select_related('metric')
        if('questionnaire_pk' in self.request.query_params):
            return query_set.filter(metric__questionnaire_id = self.request.query_params.get('questionnaire_pk'))
        return query_set

    def get_serializer_context(self):
        return {'assessment_result_id': self.kwargs['assessment_result_pk'], 'request': self.request}
    
class AddEvidenceApiView(APIView):
    @transaction.atomic
    def post(self, request, metric_value_id):
        evidence = Evidence()
        evidence.created_by = self.request.user
        evidence.description = request.data.get('description')
        evidence.metric_value_id = metric_value_id
        evidence.save()
        return Response()
    
class EvidenceUpdateAPI(APIView):
    def put(self, request, pk):
        try:
            evidence = Evidence.objects.get(pk=pk)
            evidence.description=request.data['description']
            evidence.save()
            return Response()
        except Evidence.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class EvidenceDeleteAPI(APIView):
    def delete(self, request, pk):
        try:
            instance = Evidence.objects.get(pk=pk)
        except Evidence.DoesNotExist:
            return Response({'message': 'The Evidence does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        instance.delete()
        return Response({'message': 'Evidence deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
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
    def get (self, request, assessment_project_id, questionnaire_id):
        questionnaire = Questionnaire.objects.get(id = questionnaire_id)
        content = {}
        assessment = AssessmentProject.objects.get(id = assessment_project_id)
        metric_values = assessment.get_assessment_result().metric_values.all()
        metrics = self.extract_metrics(questionnaire, metric_values)
        content['metrics'] = metrics
        content['assessment_result_id'] = assessment.get_assessment_result().id

        return Response(content)

    # TODO: Find a better way for serilizing -> pickle or serilizer.data MetricSerilizer
    def extract_metrics(self, questionnaire, metric_values):
        metrics = []
        metric_query_set = questionnaire.metric_set.all().order_by('index')
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
                    answer.add('evidences', value.evidences.values())    
                    metric.add('answer', answer)
                    break
            metrics.append(metric)
        return metrics