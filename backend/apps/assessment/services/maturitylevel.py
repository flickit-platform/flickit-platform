from baseinfo.models.metricmodels import MetricImpact, OptionValue
from assessment.fixture.dictionary import Dictionary
from assessment.models import MetricValue


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
                sorted_impacts = sorted(impacts, key=lambda x: x.level, reverse=False)
                metric_impact_attribute.add(metric_value, sorted_impacts)

        impact_metric_value_level_1 = Dictionary()
        impact_metric_value_level_2 = Dictionary()
        impact_metric_value_level_3 = Dictionary()
        impact_metric_value_level_4 = Dictionary()

        for metric_value, impacts in metric_impact_attribute.items():
            is_in_impact_level1 = False
            is_in_impact_level2 = False
            is_in_impact_level3 = False
            is_in_impact_level4 = False
            for impact in impacts:
                impact_option_values = impact.option_values.all()
                answer_value = next((x for x in list(impact_option_values) if x.option.id == metric_value.answer.id), None)
                if impact.level == 1 and metric_value.answer is not None:
                    if answer_value is None:   
                        effectivr_answer_value = OptionValue.objects.get(metric_impact = impact, value = 1)
                        impact_metric_value_level_1.add(impact, effectivr_answer_value)     
                    else:
                        impact_metric_value_level_1.add(impact, answer_value)
                        is_in_impact_level1 = True
                elif impact.level == 2 and metric_value.answer is not None:
                    if answer_value is None and is_in_impact_level1:   
                        effectivr_answer_value = OptionValue.objects.get(metric_impact = impact, value = 0)
                        impact_metric_value_level_2.add(impact, effectivr_answer_value) 
                    elif answer_value is None and not is_in_impact_level1:
                        effectivr_answer_value = OptionValue.objects.get(metric_impact = impact, value = 1)
                        impact_metric_value_level_2.add(impact, effectivr_answer_value) 
                    else:
                        impact_metric_value_level_2.add(impact, answer_value)
                        is_in_impact_level2 = True
                    
                elif impact.level == 3 and metric_value.answer is not None:
                    impact_metric_value_level_3.add(impact, answer_value)
                    if answer_value is None and (is_in_impact_level1 or is_in_impact_level2):   
                        effectivr_answer_value = OptionValue.objects.get(metric_impact = impact, value = 0)
                        impact_metric_value_level_3.add(impact, effectivr_answer_value)
                    elif answer_value is None and not is_in_impact_level1 and not is_in_impact_level2:
                        effectivr_answer_value = OptionValue.objects.get(metric_impact = impact, value = 1)
                        impact_metric_value_level_3.add(impact, effectivr_answer_value) 
                    else:
                        impact_metric_value_level_3.add(impact, answer_value)
                elif impact.level == 4 and metric_value.answer is not None:
                    impact_metric_value_level_4.add(impact, answer_value)
                    

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
            for impact, option_value in impact_metric_value_level_dict.items():
                sum_of_values += option_value.value
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

def normalize_Value(value):
    if value == 1:
        return 0
    if value == 2:
        return 0
    if value == 3:
        return 0.5
    if value == 4:
        return 0.9
    if value == 5:
        return 1