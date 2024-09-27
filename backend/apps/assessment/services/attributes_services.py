import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_evidences_with_attribute(request, assessment_id, attribute_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/attributes/{attribute_id}/evidences',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
