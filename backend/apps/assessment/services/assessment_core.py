import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT
from baseinfo.models.assessmentkitmodels import AssessmentKit, MaturityLevel


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


def get_assessment_list(space_id, request):
    result = dict()
    params = {'spaceId': space_id,
              'page': 0,
              'size': 10,
              }

    if not request.user.spaces.filter(id=space_id).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessments', params=params)
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        items = list()
        for item in data["items"]:
            row_data = dict()
            row_data["id"] = item["id"]
            row_data["title"] = item["title"]
            row_data["last_modification_time"] = item["lastModificationTime"]
            row_data["color"] = item["color"]
            row_data["is_calculate_valid"] = item["isCalculateValid"]
            if item["maturityLevelId"] is not None:
                level = MaturityLevel.objects.get(id=item["maturityLevelId"]).value()
                row_data["result_maturity_level"] = {"id": level.id,
                                                     "title": level.title,
                                                     "value": level.value
                                                     }
            else:
                row_data["result_maturity_level"] = None
            assessment_kit = AssessmentKit.objects.get(id=item["assessmentKitId"])
            row_data["assessment_kit"] = {"id": assessment_kit.id,
                                          "maturity_levels_count": assessment_kit.maturity_levels.count()
                                          }
            items.append(row_data)
        data["items"] = items
        result["Success"] = True
        result["body"] = data
        result["status_code"] = status.HTTP_200_OK
        return result
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code