import requests
import json
from assessmentplatform.settings import DSL_PARSER_URL_SERVICE, ASSESSMENT_URL
from rest_framework import status
from baseinfo.services import importassessmentkitservice


def dsl_parser_upload_dsl(dsl_contents):
    response = requests.post(DSL_PARSER_URL_SERVICE, json={"dslContent": dsl_contents})
    result = {"Success": True, "body": response.json(), "status_code": response.status_code}
    if response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
        result["Success"] = False
    if result["body"]['hasError']:
        result["body"] = {"message": "The uploaded dsl is invalid."}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
    return result


def assessment_core_dsl_update(body, assessment_kit_id):
    data = {"dslContent": json.dumps(body)}
    response = requests.put(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/update-by-dsl', json=data)
    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "body": {"message": "The assessment kit updated successfully. "}, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def dsl_parser_update(assessment_kit_id, dsl_id):
    dsl_contents = importassessmentkitservice.extract_dsl_contents(dsl_id)
    result = dsl_parser_upload_dsl(dsl_contents)
    if result["status_code"] == status.HTTP_200_OK:
        result = assessment_core_dsl_update(result["body"], assessment_kit_id)
    return result
