import requests

from assessmentplatform.settings import ASSESSMENT_URL


def update_assessment_insights(request, assessment_id):
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/insights',
                             json=request.data,
                             headers={'Authorization': request.headers['Authorization']})
    if response.status_code == 201:
        return {"Success": True, "body": None, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
