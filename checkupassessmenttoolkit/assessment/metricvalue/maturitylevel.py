from assessmentbaseinfo.models import MetricImpact
from assessment.common import *


def calculate_maturity_level(result, quality_attribute):
        metric_impact_attribute = Dictionary()
        metric_values = result.metric_values.all()
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

        impact_metric_value_level_list = []
        impact_metric_value_level_list.append(impact_metric_value_level_1)
        impact_metric_value_level_list.append(impact_metric_value_level_2)
        impact_metric_value_level_list.append(impact_metric_value_level_3)
        impact_metric_value_level_list.append(impact_metric_value_level_4)

        i = 1
        maturity_level_value = 0
        score_level_1 = 0
        score_level_2 = 0
        score_level_3 = 0
        score_level_4 = 0

        for impact_metric_value_level_dict in impact_metric_value_level_list:
            sum_of_values = 0
            for impact, value in impact_metric_value_level_dict.items():
                sum_of_values += value
            if i == 1 and len(impact_metric_value_level_dict) != 0:
                impacts = MetricImpact.objects.filter(level=1,quality_attribute=quality_attribute.id)
                score_level_1 = sum_of_values/len(impacts)
                if score_level_1 >= 0.6:
                    maturity_level_value = 1
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
            i += 1
        return maturity_level_value + 1