import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_advice(request, assessment_id):
    result = dict()
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/advice',
                             json=request.data, headers={'Authorization': request.headers['Authorization']})
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result
