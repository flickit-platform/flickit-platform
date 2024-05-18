import requests
from assessmentplatform.settings import ASSESSMENT_URL


def question_answering(request, assessment_id):
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/answer-question',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
