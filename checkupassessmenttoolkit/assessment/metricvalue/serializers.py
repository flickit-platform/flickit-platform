from rest_framework import serializers

from assessmentbaseinfo.models import Metric
from assessmentbaseinfo.serializers import AnswerTemplateSerializer
from assessmentbaseinfo.serializers import SimpleMetricSerializers

from assessment.common import *
from assessment.assessmentcommon import *
from assessment.models import MetricValue, QualityAttributeValue

from .maturitylevel import calculate_maturity_level


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

    def save(self, **kwargs):
        assessment_result_id = self.context['assessment_result_id']
        self.save_metric(assessment_result_id)
        result = self.instance.assessment_result
        self.save_qauality_att_value(result)
        update_assessment_status(result)
        return self.instance

    def save_qauality_att_value(self, result):
        quality_attributes = []
        for mi in self.instance.metric.metric_impacts.all():
            quality_attributes.append(mi.quality_attribute)
        for quality_attribute in quality_attributes:
            maturity_level_value = calculate_maturity_level(result, quality_attribute)
            try:
                att_value = QualityAttributeValue.objects.get(assessment_result_id = result.id, quality_attribute_id = quality_attribute.id)
                att_value.maturity_level_value = maturity_level_value
                att_value.save() 
            except QualityAttributeValue.DoesNotExist:
                QualityAttributeValue.objects.create(assessment_result_id = result.id, quality_attribute_id = quality_attribute.id, maturity_level_value = maturity_level_value)

    def save_metric(self, assessment_result_id):
        metric_id = self.validated_data['metric_id']
        answer = self.validated_data['answer']
        try:
            metric_value = MetricValue.objects.get(assessment_result_id=assessment_result_id, metric_id=metric_id)
            metric_value.answer = answer
            metric_value.save()
            self.instance = metric_value
        except MetricValue.DoesNotExist:
            self.instance = MetricValue.objects.create(assessment_result_id=assessment_result_id, **self.validated_data)

    class Meta:
        model = MetricValue
        fields = ['id', 'answer', 'metric_id']


class UpdateMetricValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetricValue
        fields = ['answer']