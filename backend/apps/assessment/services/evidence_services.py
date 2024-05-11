import requests

from assessmentplatform.settings import ASSESSMENT_URL


def add_evidences(request):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/evidences',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_list_evidences(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/evidences',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def edit_evidence(request, evidence_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/evidences/{evidence_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def delete_evidence(request, evidence_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/evidences/{evidence_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response}
