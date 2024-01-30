import requests
from assessmentplatform.settings import ASSESSMENT_URL


def create_expert_group(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/expert-groups',
        json=request.data,
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
