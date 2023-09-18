import requests

from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT
from baseinfo.models.assessmentkitmodels import AssessmentKit


def create_assessment(user, data):
    result = dict()
    if not user.spaces.filter(id=data["space_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        return result
    if not AssessmentKit.objects.filter(id=data["assessment_kit_id"]).filter(is_active=True).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'assessment_kit_id' does not exist"}
        return result

    body = dict()
    body["spaceId"] = data["space_id"]
    body["title"] = data["title"]
    body["assessmentKitId"] = data["assessment_kit_id"]
    if "color_id" in data:
        body["colorId"] = data["color_id"]
    response = requests.post(ASSESSMENT_URL + 'assessment-core/api/assessments', json=body)
    result["Success"] = True
    result["body"] = response
    return result
