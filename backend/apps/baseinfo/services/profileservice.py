import itertools
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from common.restutil import ActionResult

from assessment.models import AssessmentProject

from baseinfo.models.profilemodels import ProfileTag, AssessmentProfile, ProfileLike
from baseinfo.models.basemodels import QualityAttribute
from baseinfo.serializers.profileserializers import AssessmentProfileSerilizer
from baseinfo.models.profilemodels import AssessmentProfile, ProfileTag

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

def is_profile_deletable(profile_id):
    profile = load_profile(profile_id)
    if is_profile_used_in_assessments(profile):
        return ActionResult(success=False, message='Some assessments with this profile exist')    
    return ActionResult(success=True) 

def is_profile_used_in_assessments(profile: AssessmentProfile):
    qs = AssessmentProject.objects.filter(assessment_profile_id = profile.id)
    if qs.count() > 0:
        return True
    return False

def extract_detail_of_profile(profile, request):
    response = extract_profile_basic_infos(profile)
    response['profileInfos'] = extract_profile_report_infos(profile)
    response['subjectsInfos'] = extract_subjects_infos(profile)
    response['questionnaires'] = extract_questionnaires_infos(profile)
    response['maturity_levels'] = extract_profile_maturity_levels(profile)
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

def extract_profile_maturity_levels(profile: AssessmentProfile):
    response = {}
    maturity_levels = []
    for ml in profile.maturity_levels.all():
        maturity_level = {}
        maturity_level['title'] = ml.title
        maturity_level['value'] = ml.value
        maturity_levels.append(maturity_level)
    
    response['list'] = maturity_levels
    response['maturity_level_number'] = profile.maturity_levels.count()
    
    return response

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
        # metric['maturity_level'] = impact.maturity_level.value
        # metric['options'] = __extract_metric_options(impact.metric)
        options = []
        for at in impact.metric.answer_templates.all():
            option = {}
            option['title'] = at.caption
            option_values = []
            for ov in at.option_values.all():
                if ov.metric_impact.quality_attribute == att:
                    option_value = {}
                    option_value['value'] = ov.value
                    option_value['maturity_level'] = ov.metric_impact.maturity_level.value
                    option_values.append(option_value)
            option['option_values'] = option_values
            options.append(option)
        metric['options'] = options
        if metric not in questions:
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
        relatedAttributes.append({'title' : impact.quality_attribute.title, 'item': impact.maturity_level.value})
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
    if not profile.is_active:
        return ActionResult(success=False, message='The profile has already been archived')
    profile.is_active = False
    profile.save()
    return ActionResult(success=True, message='The profile is archived successfully')

@transaction.atomic     
def publish_profile(profile: AssessmentProfile):
    if profile.is_active:
        return ActionResult(success=False, message='The profile has already been published')
    profile.is_active = True
    profile.save()
    return ActionResult(success=True, message='The profile is published successfully')

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
    profile = AssessmentProfile.objects.get(pk=profile_id)
    output = []
    attributes = extract_profile_attribute(profile)
    profile_maturity_levels = profile.maturity_levels.all().order_by('value')
    for att in attributes:
        attribute_analyse = {}
        attribute_analyse['title'] = att['title']
        level_analysis = []
        for ml in profile_maturity_levels:
            attribute_metric_by_level = {}
            attribute_metric_by_level['level_value'] = ml.value
            attribute_metric_number_by_level = 0
            attribute = QualityAttribute.objects.get(id = att['id'])
            for impact in attribute.metric_impacts.all():
                if impact.maturity_level.value == ml.value:
                    attribute_metric_number_by_level = attribute_metric_number_by_level + 1
            
            attribute_metric_by_level['attribute_metric_number'] = attribute_metric_number_by_level
            level_analysis.append(attribute_metric_by_level)
        attribute_analyse['level_analysis'] = level_analysis
        output.append(attribute_analyse)
            

    return ActionResult(data=output, success=True)

def extract_profile_attribute(profile):
    subjects = profile.assessment_subjects.all()
    attributes = []
    for subject in subjects:
        attributes.append(subject.quality_attributes.values('id', 'title'))

    return list(itertools.chain(*attributes))

def get_extrac_profile_data(profile, request):
    result =[]
    data = {}
    data["id"] = profile.id
    data["title"] = profile.title
    data['summary'] = profile.summary
    data['about'] = profile.about
    data["tags"] = profile.tags.all()
    result.append(data)
    return result

@transaction.atomic
def update_profile(profile, request,**kwargs):
    if len(kwargs) == 0 :
        return ActionResult(success=False, message="All fields cannot be empty.")
    try:
        if "tags" in kwargs:
            profile.tags.clear()
            for tag in kwargs["tags"]:
                profile.tags.add(ProfileTag.objects.get(id=tag))
            profile.save()
            kwargs.pop("tags")
        profile = AssessmentProfile.objects.filter(id=profile.id).update(**kwargs)
        return ActionResult(success=True, message="Profile edited successfully.")
    except ProfileTag.DoesNotExist:
        return ActionResult(success=False, message="There is no profile tag with this id.")

