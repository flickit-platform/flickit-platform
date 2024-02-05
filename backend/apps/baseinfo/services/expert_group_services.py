import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_expert_group_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/expert-groups',
        json=request.data,
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def create_expert_group(request):
    if "picture" in request.data:
        file = request.data['picture']
        data = request.data
        data.pop('picture')
        response = requests.post(
            ASSESSMENT_URL + 'assessment-core/api/expert-groups',
            data=data,
            files={'picture': file},
            headers={'Authorization': request.headers['Authorization']})
    else:
        response = requests.post(
            ASSESSMENT_URL + 'assessment-core/api/expert-groups',
            data=request.data,
            headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
