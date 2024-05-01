import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_assessment_kit_tags(request):
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/assessment-kit-tags',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
