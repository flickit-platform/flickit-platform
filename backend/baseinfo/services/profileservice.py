from rest_framework import status
from ..serializers.profileserializers import AssessmentProfileSerilizer
from ..models.profilemodels import AssessmentProfile, ProfileTag
from assessment.models import AssessmentProject


def load_profile(profile_id) -> AssessmentProfile:
    try:
        return AssessmentProfile.objects.get(id = profile_id)
    except AssessmentProfile.DoesNotExist:
        return None

def load_profile_tag(tag_id) -> ProfileTag:
    try:
        return ProfileTag.objects.get(id = tag_id)
    except ProfileTag.DoesNotExist:
        return None

def delete_validation(profile_id, user_id):
    delete_validation_res = {}
    profile = load_profile(profile_id)
    if profile is None:
        error_message = 'The Assessment Profile with given Id {profile_id} does not exists'.format(profile_id = profile.id)
        delete_validation_res['message'] = error_message
        delete_validation_res['status'] = status.HTTP_400_BAD_REQUEST
    qs = AssessmentProject.objects.filter(assessment_profile_id = profile.id)
    if qs.count() > 0:
        delete_validation_res['message'] = 'Some assessment with this profile exist'
        delete_validation_res['status'] = status.HTTP_400_BAD_REQUEST        
    if profile.expert_group is not None:
        user = profile.expert_group.users.filter(id = user_id)
        if user.count() == 0:
            delete_validation_res['message'] = 'The current user does not have permission for deleting profile'
            delete_validation_res['status'] = status.HTTP_403_FORBIDDEN        
    return delete_validation_res

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
    categories = profile.metric_categories.all()
    for category in categories:
        category_infos = {}
        category_infos['title'] = category.title
        category_infos['description'] = category.description
        category_infos['report_infos'] = __extract_category_report_info(category)
        category_infos['questions'] = __extract_category_metric_info(category) 
        questionnairesInfos.append(category_infos)
    return questionnairesInfos

def extract_subjects_infos(profile):
    subjectsInfos = []
    subjects = profile.assessment_subjects.all()
    for subject in subjects:
        attributes_qs = subject.qualityattribute_set
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
    profileInfos.append(__extract_profile_category_count(profile.metric_categories))
    profileInfos.append(__extract_profile_attribute_count(subjects))
    profileInfos.append(__extract_profile_metric_count(profile.metric_categories))
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
    report_infos.append({'title' : 'Number of attributes', 'item': subject.qualityattribute_set.count()})
    report_infos.append({'title' : 'Index of the {}'.format(subject.title), 'item': subject.index})
    return report_infos

def __extract_category_metric_info(category):
    questions = []
    for metric in category.metric_set.all():
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

def __extract_category_report_info(category):
    report_infos = []
    report_infos.append({'title' : 'Number of questions', 'item': category.metric_set.count()})
    report_infos.append({'title' : 'Questionnaire index', 'item': category.index})
    report_infos.append({'title' : 'Related subjects', 'item': [subject.title for subject in category.assessment_subjects.all()]})
    return report_infos

def __extract_profile_subjects(subjects):
    subject_titles = [subject.title for subject in subjects]
    return {'title' : 'Subjects', 'item': subject_titles}

def __extract_profile_tags(tags):
    tag_titles = [tag.title for tag in tags]
    return {'title' : 'Tags', 'item': tag_titles, 'type': 'tags'}
    
def __extract_profile_category_count(metric_categories):
    return {'title' : 'Questionnaires count', 'item': metric_categories.count()}

def __extract_profile_metric_count(metric_categories):
    total_metric_count = 0
    for category in metric_categories.all():
        total_metric_count += category.metric_set.count()
    return {'title' : 'Total questions count', 'item': total_metric_count}

def __extract_profile_attribute_count(subjects):
    attributes = []
    for subject in subjects:
        attributes.extend(subject.qualityattribute_set.all())
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



    
