from django.db import transaction
from zipfile import ZipFile
from ..models.basemodels import MetricCategory, AssessmentSubject, QualityAttribute
from ..models.metricmodels import Metric, MetricImpact, AnswerTemplate
from ..models.profilemodels import AssessmentProfile, ProfileDsl
from ..services import profileservice, expertgroupservice

def extract_dsl_contents(dsl_id):
    dsl = ProfileDsl.objects.get(id = dsl_id)
    input_zip = ZipFile(dsl.dsl_file)
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
def import_profile(descriptive_profile, **kwargs):
    tags = extract_tags(kwargs['tag_ids'])
    expert_group = expertgroupservice.load_expert_group(kwargs['expert_group_id'])
    assessment_profile = __import_profile_base_info(descriptive_profile, tags, expert_group)
    __import_categories(descriptive_profile['categoryModels'], assessment_profile)
    __import_subjects(descriptive_profile['subjectModels'], assessment_profile)
    __import_attributes(descriptive_profile['attributeModels'])
    __import_metrics(descriptive_profile['metricModels'])
    return assessment_profile

def extract_tags(tag_ids):
    tags = []
    if tag_ids:
        for tag_id in tag_ids:
            tag = profileservice.load_profile_tag(tag_id)
            if tag:
                tags.append(tag)
    return tags


def __import_profile_base_info(descriptive_profile, tags, expert_group):
    profile_model = descriptive_profile['profileModel']
    assessment_profile = AssessmentProfile()
    assessment_profile.code = profile_model['code']
    assessment_profile.title = profile_model['title']
    assessment_profile.summary = profile_model['description']
    assessment_profile.is_default = False
    assessment_profile.save()
    for tag in tags:
        assessment_profile.tags.add(tag)
    assessment_profile.expert_group = expert_group
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
            


