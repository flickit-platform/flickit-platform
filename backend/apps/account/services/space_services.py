import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_list_members_in_space(request, space_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/members',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def add_member_in_space(request, space_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/members',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def invite_member_in_space(request, space_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/invite',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
