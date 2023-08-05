import itertools
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist

from common.restutil import ActionResult

from assessment.models import AssessmentProject
from baseinfo.services import  expertgroupservice 
from baseinfo.models.assessmentkitmodels import AssessmentKitTag, AssessmentKit, AssessmentKitLike
from baseinfo.models.basemodels import QualityAttribute
from baseinfo.serializers.assessmentkitserializers import AssessmentKitSerilizer
from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitTag , MaturityLevel ,LevelCompetence

def load_assessment_kit(assessment_kit_id) -> AssessmentKit:
    try:
        return AssessmentKit.objects.get(id = assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        raise AssessmentKit.DoesNotExist

def load_assessment_kit_tag(tag_id) -> AssessmentKitTag:
    try:
        return AssessmentKitTag.objects.get(id = tag_id)
    except AssessmentKitTag.DoesNotExist:
        raise ObjectDoesNotExist


def load_maturity_level(maturity_level_id) -> MaturityLevel:
    try:
        return MaturityLevel.objects.get(id = maturity_level_id)
    except MaturityLevel.DoesNotExist as e:
        raise MaturityLevel.DoesNotExist
    


def is_assessment_kit_deletable(assessment_kit_id):
    assessment_kit = load_assessment_kit(assessment_kit_id)
    if is_assessment_kit_used_in_assessments(assessment_kit):
        return ActionResult(success=False, message='Some assessments with this assessment_kit exist')    
    return ActionResult(success=True) 

def is_assessment_kit_used_in_assessments(assessment_kit: AssessmentKit):
    qs = AssessmentProject.objects.filter(assessment_kit_id = assessment_kit.id)
    if qs.count() > 0:
        return True
    return False

def extract_detail_of_assessment_kit(assessment_kit, request):
    response = extract_asessment_kit_basic_infos(assessment_kit)
    response['assessmentkitInfos'] = extract_asessment_kit_report_infos(assessment_kit)
    response['subjectsInfos'] = extract_subjects_infos(assessment_kit)
    response['questionnaires'] = extract_questionnaires_infos(assessment_kit)
    response['maturity_levels'] = extract_asessment_kit_maturity_levels(assessment_kit)
    extra_assessment_kit_info = AssessmentKitSerilizer(assessment_kit, context={'request': request}).data
    response['is_active'] = extra_assessment_kit_info['is_active']
    response['expert_group'] = extra_assessment_kit_info['expert_group']
    response['number_of_assessment'] = extra_assessment_kit_info['number_of_assessment']
    response['current_user_delete_permission'] = extra_assessment_kit_info['current_user_delete_permission']
    response['current_user_is_coordinator'] = extra_assessment_kit_info['current_user_is_coordinator']
    return response

def extract_asessment_kit_basic_infos(assessment_kit: AssessmentKit):
    response = {}
    response['title'] = assessment_kit.title
    response['summary'] = assessment_kit.summary
    response['about'] = assessment_kit.about
    response['last_update'] = assessment_kit.last_modification_date
    response['creation_date'] = assessment_kit.creation_time
    return response

def extract_questionnaires_infos(assessment_kit: AssessmentKit):
    questionnairesInfos = []
    questionnaires = assessment_kit.questionnaires.all()
    for questionnaire in questionnaires:
        questionnaire_infos = {}
        questionnaire_infos['title'] = questionnaire.title
        questionnaire_infos['description'] = questionnaire.description
        questionnaire_infos['report_infos'] = __extract_questionnaire_report_info(questionnaire)
        questionnaire_infos['questions'] = __extract_questionnaire_question_info(questionnaire) 
        questionnairesInfos.append(questionnaire_infos)
    return questionnairesInfos

def extract_subjects_infos(assessment_kit):
    subjectsInfos = []
    subjects = assessment_kit.assessment_subjects.all()
    for subject in subjects:
        attributes_qs = subject.quality_attributes
        subject_infos = {}
        subject_infos['title'] = subject.title
        subject_infos['description'] = subject.description
        subject_infos['report_infos'] =  __extratc_subject_report_info(subject)
        subject_infos['attributes_infos'] = __extract_subject_attributes_info(attributes_qs)
        subjectsInfos.append(subject_infos)
    return subjectsInfos

def extract_asessment_kit_maturity_levels(assessment_kit: AssessmentKit):
    response = {}
    maturity_levels = []
    for ml in assessment_kit.maturity_levels.all():
        maturity_level = {}
        maturity_level['title'] = ml.title
        maturity_level['value'] = ml.value
        maturity_levels.append(maturity_level)
    
    response['list'] = maturity_levels
    response['maturity_level_number'] = assessment_kit.maturity_levels.count()
    
    return response

def extract_asessment_kit_report_infos(assessment_kit):
    assessmentkitInfos = []
    subjects = assessment_kit.assessment_subjects.all()
    assessmentkitInfos.append(__extract_asessment_kit_questionnaire_count(assessment_kit.questionnaires))
    assessmentkitInfos.append(__extract_asessment_kit_attribute_count(subjects))
    assessmentkitInfos.append(__extract_asessment_kit_question_count(assessment_kit.questionnaires))
    assessmentkitInfos.append(__extract_asessment_kit_subjects(subjects))
    assessmentkitInfos.append(__extract_asessment_kit_tags(assessment_kit.tags.all()))
    return assessmentkitInfos

def __extract_subject_attributes_info(attributes_qs):
    attributes_infos = []
    for att in attributes_qs.all():
        att_info = {}
        att_info['title'] = att.title
        att_info['description'] = att.description
        att_info['questions'] = __extract_related_attribute_questions(att)
        attributes_infos.append(att_info)
    return attributes_infos

def __extract_related_attribute_questions(att):
    impacts = att.question_impacts.all()
    questions = []
    for impact in impacts:
        question = {}
        question['title'] = impact.question.title
        # question['maturity_level'] = impact.maturity_level.value
        # question['options'] = __extract_question_options(impact.question)
        options = []
        for at in impact.question.answer_templates.all():
            option = {}
            option['title'] = at.caption
            option_values = []
            for ov in at.option_values.all():
                if ov.question_impact.quality_attribute == att:
                    option_value = {}
                    option_value['value'] = ov.value
                    option_value['maturity_level'] = ov.question_impact.maturity_level.value
                    option_values.append(option_value)
            option['option_values'] = option_values
            options.append(option)
        question['options'] = options
        if question not in questions:
            questions.append(question)
    return questions

def __extratc_subject_report_info(subject):
    report_infos = []
    report_infos.append({'title' : 'Number of attributes', 'item': subject.quality_attributes.count()})
    report_infos.append({'title' : 'Index of the {}'.format(subject.title), 'item': subject.index})
    return report_infos

def __extract_questionnaire_question_info(questionnaire):
    questions = []
    for question in questionnaire.question_set.all():
        info = {}
        info['title'] = question.title
        info['inedx'] = question.index
        info['listOfOptions'] = __extract_question_options(question)
        info['relatedAttributes'] = __extratc_question_related_attributes(question)
        questions.append(info)
    return questions

def __extratc_question_related_attributes(question):
    relatedAttributes = []
    for impact in question.question_impacts.all():
        relatedAttributes.append({'title' : impact.quality_attribute.title, 'item': impact.maturity_level.value})
    return relatedAttributes

def __extract_question_options(question):
    return [answer.caption for answer in question.answer_templates.all()]

def __extract_questionnaire_report_info(questionnaire):
    report_infos = []
    report_infos.append({'title' : 'Number of questions', 'item': questionnaire.question_set.count()})
    report_infos.append({'title' : 'Questionnaire index', 'item': questionnaire.index})
    report_infos.append({'title' : 'Related subjects', 'item': [subject.title for subject in questionnaire.assessment_subjects.all()]})
    return report_infos

def __extract_asessment_kit_subjects(subjects):
    subject_titles = [subject.title for subject in subjects]
    return {'title' : 'Subjects', 'item': subject_titles}

def __extract_asessment_kit_tags(tags):
    tag_titles = [tag.title for tag in tags]
    return {'title' : 'Tags', 'item': tag_titles, 'type': 'tags'}
    
def __extract_asessment_kit_questionnaire_count(questionnaires):
    return {'title' : 'Questionnaires count', 'item': questionnaires.count()}

def __extract_asessment_kit_question_count(questionnaires):
    total_question_count = 0
    for questionnaire in questionnaires.all():
        total_question_count += questionnaire.question_set.count()
    return {'title' : 'Total questions count', 'item': total_question_count}

def __extract_asessment_kit_attribute_count(subjects):
    attributes = []
    for subject in subjects:
        attributes.extend(subject.quality_attributes.all())
    return {'title' : 'Attributes count', 'item': len(attributes)}


def get_current_user_delete_permission(assessment_kit: AssessmentKit, current_user_id):
    number_of_assessment = AssessmentProject.objects.filter(assessment_kit_id = assessment_kit.id).count()
    if number_of_assessment > 0:
        return False
    if assessment_kit.expert_group is not None:
        user = assessment_kit.expert_group.users.filter(id = current_user_id)
        return user.count() > 0
    return True

def get_current_user_is_coordinator(assessment_kit: AssessmentKit, current_user_id):
    if assessment_kit.expert_group is not None:
        if assessment_kit.expert_group.owner is not None:
            if assessment_kit.expert_group.owner.id == current_user_id:
                return True
    return False

@transaction.atomic
def archive_assessment_kit(assessment_kit: AssessmentKit):
    if not assessment_kit.is_active:
        return ActionResult(success=False, message='The assessment_kit has already been archived')
    assessment_kit.is_active = False
    assessment_kit.save()
    return ActionResult(success=True, message='The assessment_kit is archived successfully')

@transaction.atomic     
def publish_assessment_kit(assessment_kit: AssessmentKit):
    if assessment_kit.is_active:
        return ActionResult(success=False, message='The assessment_kit has already been published')
    assessment_kit.is_active = True
    assessment_kit.save()
    return ActionResult(success=True, message='The assessment_kit is published successfully')

@transaction.atomic
def like_assessment_kit(user, assessment_kit_id):
    assessment_kit = load_assessment_kit(assessment_kit_id)
    deleted_rows_number = AssessmentKitLike.objects.filter(user = user.id, assessment_kit_id = assessment_kit.id).delete()[0]
    if deleted_rows_number == 0:
        AssessmentKitLike.objects.create(user = user , assessment_kit = assessment_kit)
    return assessment_kit

def analyze(assessment_kit_id):
    assessment_kit = AssessmentKit.objects.get(pk=assessment_kit_id)
    output = []
    attributes = extract_asessment_kit_attribute(assessment_kit)
    assessment_kit_maturity_levels = assessment_kit.maturity_levels.all().order_by('value')
    for att in attributes:
        attribute_analyse = {}
        attribute_analyse['title'] = att['title']
        level_analysis = []
        for ml in assessment_kit_maturity_levels:
            attribute_question_by_level = {}
            attribute_question_by_level['level_value'] = ml.value
            attribute_question_number_by_level = 0
            attribute = QualityAttribute.objects.get(id = att['id'])
            for impact in attribute.question_impacts.all():
                if impact.maturity_level.value == ml.value:
                    attribute_question_number_by_level = attribute_question_number_by_level + 1
            
            attribute_question_by_level['attribute_question_number'] = attribute_question_number_by_level
            level_analysis.append(attribute_question_by_level)
        attribute_analyse['level_analysis'] = level_analysis
        output.append(attribute_analyse)
            

    return ActionResult(data=output, success=True)

def extract_asessment_kit_attribute(assessment_kit):
    subjects = assessment_kit.assessment_subjects.all()
    attributes = []
    for subject in subjects:
        attributes.append(subject.quality_attributes.values('id', 'title'))

    return list(itertools.chain(*attributes))

def get_extrac_assessment_kit_data(assessment_kit, request):
    result =[]
    data = {}
    data["id"] = assessment_kit.id
    data["title"] = assessment_kit.title
    data['summary'] = assessment_kit.summary
    data['about'] = assessment_kit.about
    data["tags"] = assessment_kit.tags.all()
    result.append(data)
    return result

@transaction.atomic
def update_assessment_kit(assessment_kit, request,**kwargs):
    if len(kwargs) == 0 :
        return ActionResult(success=False, message="All fields cannot be empty.")
    try:
        if "tags" in kwargs:
            assessment_kit.tags.clear()
            for tag in kwargs["tags"]:
                assessment_kit.tags.add(AssessmentKitTag.objects.get(id=tag))
            assessment_kit.save()
            kwargs.pop("tags")
        assessment_kit = AssessmentKit.objects.filter(id=assessment_kit.id).update(**kwargs)
        return ActionResult(success=True, message="Assessment Kit edited successfully.")
    except AssessmentKitTag.DoesNotExist:
        return ActionResult(success=False, message="There is no assessment_kit tag with this id.")


def get_level_competence_with_maturity_level(maturity_level_id):
     load_maturity = load_maturity_level(maturity_level_id)
     result = LevelCompetence.objects.filter(maturity_level=maturity_level_id)
     return result

def get_maturity_level_with_assessment_kit(assessment_kit_id):
    assessment_kit = load_assessment_kit(assessment_kit_id)
    result = MaturityLevel.objects.filter(assessment_kit = assessment_kit_id)
    return result


def get_list_assessmnet_kit_for_expert_group(user,expert_group_id):
    results = dict()
    expert_group = expertgroupservice.load_expert_group(expert_group_id)
    results['published'] = expert_group.assessmentkits.filter(is_active=True)
    if  expert_group.users.filter(id = user.id).exists():
        results['unpublished'] = expert_group.assessmentkits.filter(is_active=False)
    return results