import itertools
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, F

from common.restutil import ActionResult
from common.abstractservices import load_model

from assessment.models import AssessmentProject

from baseinfo.models.profilemodels import ProfileTag, AssessmentProfile, ProfileLike
from baseinfo.serializers.profileserializers import AssessmentProfileSerilizer
from baseinfo.serializers.commonserializers import QualityAttributeSerilizer
from baseinfo.models.profilemodels import AssessmentProfile, ProfileTag
from baseinfo.models.metricmodels import MetricImpact

def load_profile(profile_id) -> AssessmentProfile:
    try:
        return AssessmentProfile.objects.get(id = profile_id)
    except AssessmentProfile.DoesNotExist as e:
        raise AssessmentProfile.DoesNotExist

def load_profile_tag(tag_id) -> ProfileTag:
    try:
        return ProfileTag.objects.get(id = tag_id)
    except ProfileTag.DoesNotExist:
        raise ObjectDoesNotExist

def is_profile_deletable(profile_id, user_id):
    profile = load_profile(profile_id)
    if is_profile_used_in_assessments(profile):
        return False    
    if not is_user_access_to_profile(profile, user_id):
        raise PermissionDenied
    return True

def is_profile_used_in_assessments(profile: AssessmentProfile):
    qs = AssessmentProject.objects.filter(assessment_profile_id = profile.id)
    if qs.count() > 0:
        return True
    return False

def is_user_access_to_profile(profile: AssessmentProfile, user_id):
    user = profile.expert_group.users.filter(id = user_id)
    if user.count() == 0:
        return False
    return True


def extract_detail_of_profile(profile, request):
    response = extract_profile_basic_infos(profile)
    response['profileInfos'] = extract_profile_report_infos(profile)
    response['subjectsInfos'] = extract_subjects_infos(profile)
    response['questionnaires'] = extract_questionnaires_infos(profile)
    extra_profile_info = AssessmentProfileSerilizer(profile, context={'request': request}).data
    response['is_active'] = extra_profile_info['is_active']
    response['expert_group'] = extra_profile_info['expert_group']
    response['number_of_assessment'] = extra_profile_info['number_of_assessment']
    response['current_user_delete_permission'] = extra_profile_info['current_user_delete_permission']
    response['current_user_is_coordinator'] = extra_profile_info['current_user_is_coordinator']
    return response

def extract_profile_basic_infos(profile: AssessmentProfile):
    response = {}
    response['title'] = profile.title
    response['summary'] = profile.summary
    response['about'] = profile.about
    response['last_update'] = profile.last_modification_date
    response['creation_date'] = profile.creation_time
    return response

def extract_questionnaires_infos(profile: AssessmentProfile):
    questionnairesInfos = []
    questionnaires = profile.questionnaires.all()
    for questionnaire in questionnaires:
        questionnaire_infos = {}
        questionnaire_infos['title'] = questionnaire.title
        questionnaire_infos['description'] = questionnaire.description
        questionnaire_infos['report_infos'] = __extract_questionnaire_report_info(questionnaire)
        questionnaire_infos['questions'] = __extract_questionnaire_metric_info(questionnaire) 
        questionnairesInfos.append(questionnaire_infos)
    return questionnairesInfos

def extract_subjects_infos(profile):
    subjectsInfos = []
    subjects = profile.assessment_subjects.all()
    for subject in subjects:
        attributes_qs = subject.quality_attributes
        subject_infos = {}
        subject_infos['title'] = subject.title
        subject_infos['description'] = subject.description
        subject_infos['report_infos'] =  __extratc_subject_report_info(subject)
        subject_infos['attributes_infos'] = __extract_subject_attributes_info(attributes_qs)
        subjectsInfos.append(subject_infos)
    return subjectsInfos

def extract_profile_report_infos(profile):
    profileInfos = []
    subjects = profile.assessment_subjects.all()
    profileInfos.append(__extract_profile_questionnaire_count(profile.questionnaires))
    profileInfos.append(__extract_profile_attribute_count(subjects))
    profileInfos.append(__extract_profile_metric_count(profile.questionnaires))
    profileInfos.append(__extract_profile_subjects(subjects))
    profileInfos.append(__extract_profile_tags(profile.tags.all()))
    return profileInfos

def __extract_subject_attributes_info(attributes_qs):
    attributes_infos = []
    for att in attributes_qs.all():
        att_info = {}
        att_info['title'] = att.title
        att_info['description'] = att.description
        att_info['questions'] = __extract_related_attribute_metrics(att)
        attributes_infos.append(att_info)
    return attributes_infos

def __extract_related_attribute_metrics(att):
    impacts = att.metric_impacts.all()
    questions = []
    for impact in impacts:
        metric = {}
        metric['title'] = impact.metric.title
        metric['impact'] = impact.level
        metric['options'] = __extract_metric_options(impact.metric)
        questions.append(metric)
    return questions

def __extratc_subject_report_info(subject):
    report_infos = []
    report_infos.append({'title' : 'Number of attributes', 'item': subject.quality_attributes.count()})
    report_infos.append({'title' : 'Index of the {}'.format(subject.title), 'item': subject.index})
    return report_infos

def __extract_questionnaire_metric_info(questionnaire):
    questions = []
    for metric in questionnaire.metric_set.all():
        info = {}
        info['title'] = metric.title
        info['inedx'] = metric.index
        info['listOfOptions'] = __extract_metric_options(metric)
        info['relatedAttributes'] = __extratc_metric_related_attributes(metric)
        questions.append(info)
    return questions

def __extratc_metric_related_attributes(metric):
    relatedAttributes = []
    for impact in metric.metric_impacts.all():
        relatedAttributes.append({'title' : impact.quality_attribute.title, 'item': impact.level})
    return relatedAttributes

def __extract_metric_options(metric):
    return [answer.caption for answer in metric.answer_templates.all()]

def __extract_questionnaire_report_info(questionnaire):
    report_infos = []
    report_infos.append({'title' : 'Number of questions', 'item': questionnaire.metric_set.count()})
    report_infos.append({'title' : 'Questionnaire index', 'item': questionnaire.index})
    report_infos.append({'title' : 'Related subjects', 'item': [subject.title for subject in questionnaire.assessment_subjects.all()]})
    return report_infos

def __extract_profile_subjects(subjects):
    subject_titles = [subject.title for subject in subjects]
    return {'title' : 'Subjects', 'item': subject_titles}

def __extract_profile_tags(tags):
    tag_titles = [tag.title for tag in tags]
    return {'title' : 'Tags', 'item': tag_titles, 'type': 'tags'}
    
def __extract_profile_questionnaire_count(questionnaires):
    return {'title' : 'Questionnaires count', 'item': questionnaires.count()}

def __extract_profile_metric_count(questionnaires):
    total_metric_count = 0
    for questionnaire in questionnaires.all():
        total_metric_count += questionnaire.metric_set.count()
    return {'title' : 'Total questions count', 'item': total_metric_count}

def __extract_profile_attribute_count(subjects):
    attributes = []
    for subject in subjects:
        attributes.extend(subject.quality_attributes.all())
    return {'title' : 'Attributes count', 'item': len(attributes)}


def get_current_user_delete_permission(profile: AssessmentProfile, current_user_id):
    number_of_assessment = AssessmentProject.objects.filter(assessment_profile_id = profile.id).count()
    if number_of_assessment > 0:
        return False
    if profile.expert_group is not None:
        user = profile.expert_group.users.filter(id = current_user_id)
        return user.count() > 0
    return True

def get_current_user_is_coordinator(profile: AssessmentProfile, current_user_id):
    if profile.expert_group is not None:
        if profile.expert_group.owner is not None:
            if profile.expert_group.owner.id == current_user_id:
                return True
    return False

@transaction.atomic
def archive_profile(profile: AssessmentProfile):
    profile.is_active = False
    profile.save()
    return ActionResult(True, "The profile is archived successfully")

@transaction.atomic     
def publish_profile(profile: AssessmentProfile, user_id):
    if profile.is_active:
        return False
    if not is_user_access_to_profile(profile, user_id):
        raise PermissionDenied
    profile.is_active = True
    profile.save()
    return True

@transaction.atomic
def like_profile(user_id, profile_id):
    profile = load_profile(profile_id)
    profile_like_user = ProfileLike.objects.filter(user_id = user_id, profile_id = profile.id)
    if profile_like_user.count() == 1:
        profile.likes.filter(user_id = user_id, profile_id = profile.id).delete()
        profile.save()
    elif profile_like_user.count() == 0:
        profile_like_create = ProfileLike.objects.create(user_id = user_id, profile_id = profile.id)
        profile.likes.add(profile_like_create)
        profile.save()
    return profile

def analyze(profile_id):
    # Load the AssessmentProfile model with the given ID
    profile = AssessmentProfile.objects.get(pk=profile_id)

    # Query the MetricImpact objects filtered by the given profile ID and annotate them by the metric number
    queryset = MetricImpact.objects.filter(
        quality_attribute__assessment_subject__assessment_profile=profile
    ).values('quality_attribute__title', 'level').annotate(
        metric_number=Count('metric')
    ).order_by('quality_attribute__title', 'level')

    # Define an empty dictionary to hold the aggregated data
    result = {}

    # Iterate over the queryset, aggregating by quality attribute and level
    for obj in queryset:
        title = obj['quality_attribute__title']
        level = obj['level']
        metric_number = obj['metric_number']

        # If the quality attribute is not in the result dictionary, add it with an empty dictionary as the value
        if title not in result:
            result[title] = {}

        # If the level is not in the quality attribute's dictionary, add it with the metric number as the value
        if level not in result[title]:
            result[title][level] = metric_number

    # Convert the aggregated data into the desired output format
    output = []
    for title, levels in result.items():
        metrics_number_by_level = [{'level': level, 'metric_number': metric_number} for level, metric_number in levels.items()]
        output.append({'attributes': title, 'metrics_number_by_level': metrics_number_by_level})

    # Return the output as a successful ActionResult
    return ActionResult(data=output, success=True)

def extract_profile_attribute(profile):
    subjects = profile.assessment_subjects.all()
    attributes = []
    for subject in subjects:
        attributes.append(subject.quality_attributes.values('id', 'title'))
    return list(itertools.chain(*attributes))


    
    


    
