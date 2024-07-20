import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_questionnaires_with_assessment_kit(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_kit_id}/questionnaires',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def assessment_delete(request, assessment_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": False, "body": None, "status_code": response.status_code}
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def edit_assessment(request, assessment_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_assessment(request):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def load_assessment(request, assessment_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def list_assessments(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/assessments',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def assessments_comparable_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/comparable-assessments',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def assessments_invite_user(request, assessment_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/invite',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def assessment_invitees(request, assessment_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/invitees',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
