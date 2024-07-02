import requests
from assessmentplatform.settings import ASSESSMENT_URL


def user_info(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/users/me',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}

