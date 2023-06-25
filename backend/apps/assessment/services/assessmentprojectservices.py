from common.abstractservices import load_model
from assessment.models import AssessmentProject 

def extract_assessments(assessment_list_ids):
    assessment_lists = []
    for assessment_id in assessment_list_ids:
        assessment_project = load_model(AssessmentProject, assessment_id)
        assessment_lists.append(assessment_project)
    return assessment_lists

def extract_user_assessments(current_user_space_list, assessment_kit_id):
    query_set = AssessmentProject.objects.none()
    for space in current_user_space_list:
        if assessment_kit_id is not None:
            query_set |= AssessmentProject.objects.filter(space_id=space.id, assessment_kit_id=assessment_kit_id)
        else:
            query_set |= AssessmentProject.objects.filter(space_id=space.id)
    return query_set