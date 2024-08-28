import requests

from assessmentplatform.settings import ASSESSMENT_URL


def create_assessment_insights(request, assessment_id):
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/insights',
                             json=request.data,
                             headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 201:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_assessment_insights(request, assessment_id):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/insights',
                            headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_assessment_subject_insights(request, assessment_id, subject_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/insights/subjects/{subject_id}',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_assessment_subject_insights(request, assessment_id, subject_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/insights/subjects/{subject_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
