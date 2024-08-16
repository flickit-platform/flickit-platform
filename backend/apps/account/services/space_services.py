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


def create_spacer(request):
    response = requests.post(
        ASSESSMENT_URL + 'assessment-core/api/spaces',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def space_seen_service(request, space_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/seen',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_space(request, space_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_spaces_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/spaces',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def delete_member_space(request, space_id, member_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/members/{member_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def space_invites_list(request, space_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/invitees',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def update_space(request, space_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_space(request, space_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def leave_space(request, space_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/spaces/{space_id}/leave',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def remove_space_invite(request, invite_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/space-invitations/{invite_id}',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def space_assessment_list(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/space-assessments',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
