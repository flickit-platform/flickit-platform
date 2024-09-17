import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_advice(request, assessment_id):
    result = dict()
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/advice',
                             json=request.data, headers={'Authorization': request.headers['Authorization']})
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_advice_narration(request, assessment_id):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/advice-narration',
                            headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_advice_narration_ai(request, assessment_id):
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/advice-narration-ai',
                             json=request.data,
                             headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_advice_narration(request, assessment_id):
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/advice-narration',
                             json=request.data,
                             headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 201:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": None, "status_code": response.status_code}
