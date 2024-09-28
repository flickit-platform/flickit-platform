import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_notify_settings(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/notification-platform-settings',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
