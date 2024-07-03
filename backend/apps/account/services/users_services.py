import requests
from assessmentplatform.settings import ASSESSMENT_URL


def user_info(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/users/me',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def load_user_profile(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/user-profile',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def edit_user_profile(request):
    response = requests.put(
        ASSESSMENT_URL + 'assessment-core/api/user-profile',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 200:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
