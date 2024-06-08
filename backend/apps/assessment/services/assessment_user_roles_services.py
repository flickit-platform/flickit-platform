import requests

from assessmentplatform.settings import ASSESSMENT_URL


def assessment_user_roles_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/assessment-user-roles',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_user_role_in_assessment(request, assessment_id, user_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/assessment-user-roles/{user_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 200:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def add_user_role_in_assessment(request, assessment_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/assessment-user-roles',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 201:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_user_role_in_assessment(request, assessment_id, user_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/assessment-user-roles/{user_id}',
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 204:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def assessment_user_list(request, assessment_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/users',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
