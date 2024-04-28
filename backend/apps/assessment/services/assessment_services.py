import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_questionnaires_with_assessment_kit(request, assessment_kit_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_kit_id}/questionnaires',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}

