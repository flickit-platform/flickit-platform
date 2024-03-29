import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL


def load_assessment_details_with_id(request, assessment_id):
    result = dict()
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}')
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        if not request.user.spaces.filter(id=data["spaceId"]).exists():
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


def get_assessment_kit_assessment_count(assessment_kit_id=None, space_id=None, total_count=False, not_deleted=False, deleted=False):
    params = {"assessmentKitId": assessment_kit_id,
              "spaceId": space_id,
              "deleted": deleted,
              "total": total_count,
              "notDeleted": not_deleted
              }
    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessments/counters', params=params)
    return response.json()
