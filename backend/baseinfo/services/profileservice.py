from ..models import AssessmentProfile


def load_profile(profile_id) -> AssessmentProfile:
    try:
        return AssessmentProfile.objects.get(id = profile_id)
    except AssessmentProfile.DoesNotExist:
        return None

def extract_questionnaires_infos(profile):
    questionnairesInfos = []
    categories = profile.metric_categories.all()
    for category in categories:
        category_infos = {}
        category_infos['title'] = category.title
        category_infos['description'] = category.description
        report_infos = []
        report_infos.append({'title' : 'Related subjects', 'item': [subject.title for subject in category.assessment_subjects.all()]})
        report_infos.append({'title' : 'Number of questions', 'item': category.metric_set.count()})
        report_infos.append({'title' : 'Questionnaire index', 'item': category.index})
        category_infos['report_infos'] = report_infos
        questions = []
        for metric in category.metric_set.all():
            info = {}
            info['title'] = metric.title
            info['inedx'] = metric.index
            info['listOfOptions'] = [answer.caption for answer in metric.answer_templates.all()]
            relatedAttributes = []
            for impact in metric.metric_impacts.all():
                relatedAttributes.append({'title' : impact.quality_attribute.title, 'item': impact.level})
            info['relatedAttributes'] = relatedAttributes
            questions.append(info) 
        category_infos['questions'] = questions
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
        report_infos = []
        report_infos.append({'title' : 'Number of attributes', 'item': attributes_qs.count()})
        report_infos.append({'title' : 'Index of the Team', 'item': subject.index})
        subject_infos['report_infos'] = report_infos
        attributes_infos = []
        for att in attributes_qs.all():
            att_info = {}
            att_info['title'] = att.title
            att_info['description'] = att.description
            impacts = att.metric_impacts.all()
            questions = []
            for impact in impacts:
                metric = {}
                metric['title'] = impact.metric.title
                metric['impact'] = impact.level
                questions.append(metric)
            att_info['questions'] = questions
            attributes_infos.append(att_info)
        subject_infos['attributes_infos'] = attributes_infos
        subjectsInfos.append(subject_infos)
    return subjectsInfos

def extract_profile_infos(profile):
    profileInfos = []
    subjects = profile.assessment_subjects.all()
    profileInfos.append(__extract_profile_subjects(subjects))
    profileInfos.append(__extract_profile_category_count(profile.metric_categories))
    profileInfos.append(__extract_profile_attribute_count(subjects))
    return profileInfos

def __extract_profile_subjects(subjects):
    subject_titles = [subject.title for subject in subjects]
    return {'title' : 'Subjects', 'item': subject_titles}
    
def __extract_profile_category_count(metric_categories):
    return {'title' : 'Questionnaires count', 'item': metric_categories.count()}

def __extract_profile_attribute_count(subjects):
    attributes = []
    for subject in subjects:
        attributes.extend(subject.qualityattribute_set.all())
    return {'title' : 'Attributes count', 'item': len(attributes)}
    
