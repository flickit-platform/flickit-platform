import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL


def load_assessment_details_with_id(request, assessment_id):
    result = dict()
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}',
                            headers={'Authorization': request.headers['Authorization']})
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        if not request.user.spaces.filter(id=data["space"]["id"]).exists():
            result["Success"] = False
            result["body"] = {"code": "no assessment found by this 'assessmentId'"}
            result["status_code"] = status.HTTP_400_BAD_REQUEST
            return result
        result["Success"] = True
        result["body"] = response.json()
        result["status_code"] = response.status_code
        return result
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result
