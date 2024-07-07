import requests
from assessmentplatform.settings import ASSESSMENT_URL
from baseinfo.services.user_access_services import check_email_exists


def get_expert_group_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/expert-groups',
        json=request.data,
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_expert_group(request):
    if "picture" in request.data:
        file = request.data.get('picture')
        data = request.data
        data.pop('picture')
        response = requests.post(
            ASSESSMENT_URL + 'assessment-core/api/expert-groups',
            data=data,
            files={'picture': (file.name, file, file.content_type)},
            headers={'Authorization': request.headers['Authorization']})
    else:
        response = requests.post(
            ASSESSMENT_URL + 'assessment-core/api/expert-groups',
            data=request.data,
            headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_expert_group_details(request, expert_group_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}',
        json=request.data,
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_expert_group_members(request, expert_group_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/members',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def add_expert_group_members(request, expert_group_id, request_body):
    result = check_email_exists(request_body["email"])
    if not result["Success"]:
        return result
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/invite',
        json={"userId": result["body"]["id"]},
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 201:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def confirm_expert_group_members(request, expert_group_id, invite_token):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/invite/{invite_token}/confirm',
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 200:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_expert_group_member(request, expert_group_id, user_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/members/{user_id}',
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 204:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_expert_group(request, expert_group_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}',
        headers={'Authorization': request.headers['Authorization']})

    if response.status_code == 204:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_list_with_expert_group_id(request, expert_group_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/assessment-kits',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def expert_group_seen(request, expert_group_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/seen',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def update_expert_group(request, expert_group_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def update_expert_group_picture(request, expert_group_id):
    data = request.data
    file = data.pop('picture')
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/picture',
        data=data,
        files={'pictureFile': (file.name, file, file.content_type)},
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_expert_group_picture(request, expert_group_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups/{expert_group_id}/picture',
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 204:
        return {"Success": True, "body": "", "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
