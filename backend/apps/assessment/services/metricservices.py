from assessment.fixture.dictionary import Dictionary

# TODO: Handle with a better way for serilizing -> pickle or serilizer.data MetricSerilizer
def extract_metrics(questionnaire, metric_values):
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