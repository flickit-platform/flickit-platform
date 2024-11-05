import requests
from assessmentplatform.settings import ASSESSMENT_URL


def load_kit_with_version_id(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_subject_kit_version(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_maturity_levels_with_kit_version(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_maturity_level_with_kit_version(request, kit_version_id, maturity_level_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels/{maturity_level_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_maturity_level_with_kit_version(request, kit_version_id, maturity_level_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels/{maturity_level_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_maturity_levels_order(request, kit_version_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels-change-order',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_maturity_levels_with_kit_version(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_level_competence(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/level-competences',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 201:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def update_level_competence(request, kit_version_id, level_competence_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/level-competences/{level_competence_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_level_competence(request, kit_version_id, level_competence_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/level-competences/{level_competence_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_level_competences_list(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/level-competences',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def kit_active(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/activate',
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_subjects_list(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_subject(request, kit_version_id, subject_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects/{subject_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_subject_with_kit_version_id(request, kit_version_id, subject_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects/{subject_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_subject_order(request, kit_version_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects-change-order',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_attribute(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/attributes',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_attributes_list(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/attributes',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_attribute(request, kit_version_id, attribute_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/attributes/{attribute_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_attribute(request, kit_version_id, attribute_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/attributes/{attribute_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_attribute_order(request, kit_version_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/attributes-change-order',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_questionnaire(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_questionnaires_list(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_questionnaire(request, kit_version_id, questionnaire_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires/{questionnaire_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_questionnaire(request, kit_version_id, questionnaire_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires/{questionnaire_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_questionnaire_order(request, kit_version_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires-change-order',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_question(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_question(request, kit_version_id, question_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions/{question_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_question(request, kit_version_id, question_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions/{question_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_questions_order(request, kit_version_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions-change-order',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_question_impact(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/question-impacts',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_question_impacts_list(request, kit_version_id, question_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions/{question_id}/impacts',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_question_impact(request, kit_version_id, question_impact_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/question-impacts/{question_impact_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_question_impact(request, kit_version_id, question_impact_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/question-impacts/{question_impact_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_answer_option(request, kit_version_id, answer_option_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/answer-options/{answer_option_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_question_options_list(request, kit_version_id, question_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questions/{question_id}/options',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_questionnaire_questions_list(request, kit_version_id, questionnaire_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/questionnaires/{questionnaire_id}/questions',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_answer_ranges(request, kit_version_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/answer-ranges',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def delete_kit_version(request, kit_version_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def update_answer_range(request, kit_version_id, answer_range_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/answer-ranges/{answer_range_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
