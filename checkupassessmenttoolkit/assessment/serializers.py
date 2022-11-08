from rest_framework import serializers
from assessmentbaseinfo.models import Metric

from assessmentbaseinfo.serializers import AssessmentProfileSerilizer
from assessmentbaseinfo.serializers import AnswerTemplateSerializer
from assessmentbaseinfo.serializers import QualityAttributeSerilizer
from assessmentbaseinfo.serializers import MetricImpactSerilizer
from assessmentbaseinfo.models import QualityAttribute
from assessmentbaseinfo.models import MetricCategory
from assessmentbaseinfo.models import MetricImpact
from .common import *
from .models import AssessmentProject, AssessmentResult, Color, MetricValue, QualityAttributeValue
from statistics import mean


class ColorSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = Color
        fields = ['id', 'title', 'color_code']


class AssessmentProjectListSerilizer(serializers.ModelSerializer):
    assessment_profile = AssessmentProfileSerilizer()
    id = serializers.UUIDField(read_only=True)
    color = ColorSerilizer()
    class Meta:
        model = AssessmentProject
        fields = ['id', 'code', 'title', 'assessment_profile', 'last_modification_date', 'status', 'color', 'assessment_results']

class AssessmentProjecCreateSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = AssessmentProject
        fields = ['id', 'title', 'color', 'space']

class SimpleMetricSerializers(serializers.ModelSerializer):
    quality_attributes = QualityAttributeSerilizer(many=True)
    metric_impacts = MetricImpactSerilizer(many=True)
    class Meta:
        model = Metric
        fields = ['id', 'title', 'index', 'quality_attributes', 'metric_impacts']

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
            raise serializers.ValidationError(
                'No Metric with the given ID was found.')
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
        metric_id = self.validated_data['metric_id']
        answer = self.validated_data['answer']
        try:
            metric_value = MetricValue.objects.get(assessment_result_id=assessment_result_id, metric_id=metric_id)
            metric_value.answer = answer
            metric_value.save()
            self.instance = metric_value
        except MetricValue.DoesNotExist:
            self.instance = MetricValue.objects.create(assessment_result_id=assessment_result_id, **self.validated_data)

        result = self.instance.assessment_result
        # if answer is not None:
        quality_attributes = []
        for mi in self.instance.metric.metric_impacts.all():
            quality_attributes.append(mi.quality_attribute)
        for quality_attribute in quality_attributes:
            maturity_level_value = self.calculate_maturity_level(quality_attribute)
            try:
                att_value = QualityAttributeValue.objects.get(assessment_result_id = result.id, quality_attribute_id = quality_attribute.id)
                att_value.maturity_level_value = maturity_level_value
                att_value.save() 
            except QualityAttributeValue.DoesNotExist:
                QualityAttributeValue.objects.create(assessment_result_id = result.id, quality_attribute_id = quality_attribute.id, maturity_level_value = maturity_level_value)

        
        total_metric_number = 0
        total_answered_metric_number = 0
        for category in MetricCategory.objects.all():
            metrics = category.metric_set.all()
            total_metric_number += len(metrics)
            answered_metric = 0
            for metric in metrics:
                metric_values = metric.metric_values
                for value in metric_values.filter(assessment_result_id=result.id).all():
                    if value.metric_id == metric.id:
                        if value.answer is not None:
                            answered_metric += 1
            total_answered_metric_number += answered_metric 
        print(total_answered_metric_number)
        print(total_metric_number)
        if total_answered_metric_number <= 5:
            status = None
        else:
            value = round(mean([item.maturity_level_value for item in result.quality_attribute_values.all()]))
            status = calculate_staus(value)
        assessment = AssessmentProject.objects.get(id = result.assessment_project_id)           
        assessment.status = status
        assessment.save()
        
        return self.instance

    def calculate_maturity_level(self, quality_attribute):
        # for creating qulaity_attribute_value
        metric_impact_attribute = Dictionary()
        metric_values = self.instance.assessment_result.metric_values.all()
        for metric_value in metric_values:
            metric_impacts = metric_value.metric.metric_impacts.all()
            impacts = []
            for impact in metric_impacts:
                if impact.quality_attribute.id == quality_attribute.id:
                    impacts.append(impact)
            if impacts:
                metric_impact_attribute.add(metric_value, impacts)

        impact_metric_value_level_1 = Dictionary()
        impact_metric_value_level_2 = Dictionary()
        impact_metric_value_level_3 = Dictionary()
        impact_metric_value_level_4 = Dictionary()
        # impact_metric_value_level_5 = Dictionary()

        for metric_value, impacts in metric_impact_attribute.items():
            for impact in impacts:
                if impact.level == 1 and metric_value.answer is not None:
                    impact_metric_value_level_1.add(impact, normlize_Value(metric_value.answer.value))
                elif impact.level == 2 and metric_value.answer is not None:
                    impact_metric_value_level_2.add(impact, normlize_Value(metric_value.answer.value))
                elif impact.level == 3 and metric_value.answer is not None:
                    impact_metric_value_level_3.add(impact, normlize_Value(metric_value.answer.value))
                elif impact.level == 4 and metric_value.answer is not None:
                    impact_metric_value_level_4.add(impact, normlize_Value(metric_value.answer.value))
                # elif impact.level == 5:
                #     impact_metric_value_level_5.add(impact, normlize_Value(metric_value.answer.value))

        impact_metric_value_level_list = []
        impact_metric_value_level_list.append(impact_metric_value_level_1)
        impact_metric_value_level_list.append(impact_metric_value_level_2)
        impact_metric_value_level_list.append(impact_metric_value_level_3)
        impact_metric_value_level_list.append(impact_metric_value_level_4)
        # impact_metric_value_level_list.append(impact_metric_value_level_5)

        i = 1
        maturity_level_value = 0
        score_level_1 = 0
        score_level_2 = 0
        score_level_3 = 0
        score_level_4 = 0
        # score_level_5 = 0



        for impact_metric_value_level_dict in impact_metric_value_level_list:
            sum_of_values = 0
            for impact, value in impact_metric_value_level_dict.items():
                sum_of_values += value
            if i == 1 and len(impact_metric_value_level_dict) != 0:
                impacts = MetricImpact.objects.filter(level=1,quality_attribute=quality_attribute.id)
                score_level_1 = sum_of_values/len(impacts)
                if score_level_1 >= 0.6:
                    maturity_level_value += 1
            if i == 2 and len(impact_metric_value_level_dict) != 0:
                impacts = MetricImpact.objects.filter(level=2,quality_attribute=quality_attribute.id)
                score_level_2 = sum_of_values/len(impacts)
                if score_level_1 >= 0.7 and score_level_2 >= 0.6:
                    maturity_level_value = 2
            if i == 3 and len(impact_metric_value_level_dict) != 0:
                impacts = MetricImpact.objects.filter(level=3,quality_attribute=quality_attribute.id)
                score_level_3 = sum_of_values/len(impacts)
                if score_level_1 >= 0.8 and score_level_2 >= 0.7 and score_level_3 >= 0.6:
                    maturity_level_value = 3
            if i == 4 and len(impact_metric_value_level_dict) != 0:
                impacts = MetricImpact.objects.filter(level=4,quality_attribute=quality_attribute.id)
                score_level_4 = sum_of_values/len(impacts)
                if score_level_1 >= 0.9 and score_level_2 >= 0.8 and score_level_3 >= 0.7 and score_level_4 >= 0.6:
                    maturity_level_value = 4
            # if i == 5 and len(impact_metric_value_level_dict) != 0:
            #     score_level_5 = sum_of_values/len(impact_metric_value_level_dict)
            #     if score_level_1 >= 1 and score_level_2 >= 0.9 and score_level_3 >= 0.8 and score_level_4 >= 0.7 and score_level_5 >= 0.6:
            #         maturity_level_value = 5
            i += 1
        return maturity_level_value + 1

    class Meta:
        model = MetricValue
        fields = ['id', 'answer', 'metric_id']


class UpdateMetricValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetricValue
        fields = ['answer']


class AssessmentResultSerilizer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    class Meta:
        model = AssessmentResult
        fields = ['id', 'assessment_project']


class QualityAttributeValueSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    quality_attribute = QualityAttributeSerilizer()
    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'maturity_level_value', 'assessment_result', 'quality_attribute']

class AddQualityAttributeValueSerializer(serializers.ModelSerializer):
    quality_attribute_id = serializers.IntegerField()
    id = serializers.UUIDField(read_only=True)
    def validate_quality_attribute_id(self, value):
        if not QualityAttribute.objects.filter(pk=value).exists():
            raise serializers.ValidationError(
                'No quality Attribute with the given ID was found.')
        return value

    def save(self, **kwargs):
        assessment_result_id = self.context['assessment_result_id']
        quality_attribute_id = self.validated_data['quality_attribute_id']
        maturity_level_value = self.validated_data['maturity_level_value']
        try:
            quality_attribute_value = QualityAttributeValue.objects.get(assessment_result_id=assessment_result_id, quality_attribute_id=quality_attribute_id)
            quality_attribute_value.maturity_level_value = maturity_level_value
            quality_attribute_value.save()
            self.instance = quality_attribute_value
        except QualityAttributeValue.DoesNotExist:
            self.instance = QualityAttributeValue.objects.create(assessment_result_id=assessment_result_id, **self.validated_data)
        
        return self.instance

    class Meta:
        model = QualityAttributeValue
        fields = ['id', 'maturity_level_value', 'quality_attribute_id']


# class UpdateMetricValueSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MetricValue
#         fields = ['answer']
