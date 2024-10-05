import requests
from assessmentplatform.settings import ASSESSMENT_URL

def create_subject_kit_version(request,kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/subjects',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_maturity_levels_with_kit_version(request, kit_version_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/kit-versions/{kit_version_id}/maturity-levels',
        json=request.data,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
