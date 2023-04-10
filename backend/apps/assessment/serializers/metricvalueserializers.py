from django.db import transaction
from rest_framework import serializers

from baseinfo.models.metricmodels import Metric
from baseinfo.serializers.commonserializers import AnswerTemplateSerializer, SimpleMetricSerializers

from assessment.models import MetricValue
from assessment.fixture.common import update_assessment_status
from assessment.services import attributeservices

class MetricValueSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    answer = AnswerTemplateSerializer()
    metric = SimpleMetricSerializers()
    class Meta:
        model = MetricValue
        fields = ['id', 'answer', 'assessment_result', 'metric']

class AddMetricValueSerializer(serializers.ModelSerializer):
    metric_id = serializers.IntegerField()
    id = serializers.UUIDField(read_only=True)
    def validate_metric_id(self, value):
        if not Metric.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Metric with the given ID was found.')
        return value
    
    def validate(self, attrs):
        answer_template = attrs['answer']
        if answer_template is None:
            return attrs
        if attrs['metric_id'] != answer_template.metric.id :
            raise serializers.ValidationError(
                'The options is invalid')
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        assessment_result_id = self.context['assessment_result_id']
        self.save_metric(assessment_result_id)
        assessment_result = self.instance.assessment_result
        metric_impacts = self.instance.metric.metric_impacts.all()
        attributeservices.save_qauality_att_value(metric_impacts, assessment_result)
        update_assessment_status(assessment_result)
        return self.instance
    
    def save_metric(self, assessment_result_id):
        metric_id = self.validated_data['metric_id']
        answer = self.validated_data['answer']
        try:
            metric_value = MetricValue.objects.get(assessment_result_id=assessment_result_id, metric_id=metric_id)
            metric_value.answer = answer
            metric_value.save()
            self.instance = metric_value
        except MetricValue.DoesNotExist:
            metric_value = MetricValue()
            metric_value.assessment_result_id = assessment_result_id
            metric_value.answer = answer
            metric_value.metric_id = metric_id
            metric_value.save()
            self.instance = metric_value
            # self.instance = MetricValue.objects.create(assessment_result_id=assessment_result_id, **self.validated_data)
    
    class Meta:
        model = MetricValue
        fields = ['id', 'answer', 'metric_id']