import requests

from assessmentplatform.settings import ASSESSMENT_URL


def assessment_user_roles_list(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/assessment-user-roles',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
