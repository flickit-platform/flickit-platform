import requests
from assessmentplatform.settings import ASSESSMENT_URL


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
