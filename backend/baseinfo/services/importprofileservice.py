from django.db import transaction
from baseinfo.models import AssessmentProfile, MetricCategory, AssessmentSubject \
    , QualityAttribute, Metric, MetricImpact, AnswerTemplate

def extract_dsl_contents(input_zip):
    all_content = ''
    for name in input_zip.namelist():
        content = input_zip.read(name).decode('utf-8')
        trim_content = __trim_content(content)
        all_content = all_content + '\n' + trim_content
    return all_content

def __trim_content(content):
    new_content = ''
    for line in content.splitlines():
        if not line.strip().startswith('import'):
            line = line.replace('.', '')
            new_content = new_content + '\n' + line
    return new_content
@transaction.atomic
def import_profile(descriptive_profile):
    assessment_profile = __import_profile_base_info(descriptive_profile)
    __import_categories(descriptive_profile['categoryModels'], assessment_profile)
    __import_subjects(descriptive_profile['subjectModels'], assessment_profile)
    __import_attributes(descriptive_profile['attributeModels'])
    __import_metrics(descriptive_profile['metricModels'])
    pass


def __import_profile_base_info(descriptive_profile):
    profile_model = descriptive_profile['profileModel']
    assessment_profile = AssessmentProfile()
    assessment_profile.code = profile_model['code']
    assessment_profile.title = profile_model['title']
    assessment_profile.description = profile_model['description']
    assessment_profile.is_default = False
    assessment_profile.save()
    return assessment_profile

def __import_categories(category_models, profile):
    for category_model in category_models:
        category = MetricCategory()
        category.code = category_model['code']
        category.title = category_model['title']
        category.description = category_model['description']
        category.index = category_model['index']
        category.assessment_profile = profile
        category.save()

def __import_subjects(subject_models, profile):
    for model in subject_models:
        subject = AssessmentSubject()
        subject.code = model['code']
        subject.title = model['title']
        subject.description = model['description']
        subject.index = model['index']
        subject.assessment_profile = profile
        category_codes = model['categoryCodes']
        subject.save()
        for category_code in category_codes:
            metric_category = MetricCategory.objects.filter(code = category_code).first()
            subject.metric_categories.add(metric_category)
            subject.save()
        

def __import_attributes(attributeModels):
    for model in attributeModels:
        attribute = QualityAttribute()
        attribute.code = model['code']
        attribute.title = model['title']
        attribute.description = model['description']
        attribute.index = model['index']
        attribute.assessment_subject = AssessmentSubject.objects.filter(code = model['subjectCode']).first()
        attribute.save()


def __import_metrics(metricModels):
    for model in metricModels:
        metric = Metric()
        metric.title = model['question']
        metric.index = model['index']
        metric.metric_category = MetricCategory.objects.filter(code=model['categoryCode']).first()
        metric.save()
        for impact_model in model['metricImpacts']:
            impact = MetricImpact()
            impact.level = impact_model['level']
            impact.quality_attribute = QualityAttribute.objects.filter(code = impact_model['attributeCode']).first()
            impact.metric = metric
            impact.save()
        for answer_model in model['answers']:
            answer = AnswerTemplate()
            answer.caption = answer_model['caption']
            answer.value = answer_model['value']
            answer.metric = metric
            answer.save()
            metric.answer_templates.add(answer)
        metric.save()
            


