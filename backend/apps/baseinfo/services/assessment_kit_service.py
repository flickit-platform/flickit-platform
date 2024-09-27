import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_assessment_kit_state(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/stats',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_info(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/info',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details_subjects(request, assessment_kit_id, subject_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details/subjects/{subject_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details_attributes(request, assessment_kit_id, attribute_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details_questionnaires(request, assessment_kit_id, questionnaire_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details/questionnaires/{questionnaire_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details_question(request, assessment_kit_id, question_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details/questions/{question_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_details_maturity_levels_as_attribute(request, assessment_kit_id, attribute_id,
                                                            maturity_level_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/details/attributes/{attribute_id}/maturity-levels/{maturity_level_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_assessment_kit(request, assessment_kit_id):
    response = requests.patch(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_assessment_kit(request, assessment_kit_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def like_assessment_kit(request, assessment_kit_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/likes',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kits_list(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_publish(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def assessment_kit_search(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/options/search',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}