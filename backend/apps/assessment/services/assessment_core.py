import requests
from rest_framework import status

from account.services import space_services
from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT


def get_subject_progress(request, assessment_id, subject_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/subjects/{subject_id}/progress',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_title_by_id(data, target_id):
    for item in data:
        if item.get("id") == target_id:
            return item.get("title")
    return None


def get_questionnaires(request, assessment_id, questionnaire_id):
    page = 0
    while True:
        query_params = {"page": page}
        headers = {'Authorization': request.headers.get('Authorization')}
        result = requests.get(
            ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/questionnaires',
            params=query_params,
            headers=headers
        )

        if result.status_code != 200:
            return None

        response_body = result.json()
        questionnaires_list = response_body.get("items", [])
        title = get_title_by_id(questionnaires_list, questionnaire_id)
        if title:
            return title

        if len(questionnaires_list) < response_body.get("size", 0):
            break

        page += 1

    return None


def get_path_info_with_assessment_id(request, assessments_details):
    result = {"status_code": status.HTTP_200_OK}
    questionnaire = None

    if "questionnaire_id" in request.query_params:
        questionnaire_id = int(request.query_params["questionnaire_id"])
        questionnaire_title = get_questionnaires(request, assessments_details["id"], questionnaire_id)
        if questionnaire_title is not None:
            questionnaire = {"id": questionnaire_id, "title": questionnaire_title}
        else:
            return {
                "Success": False,
                "body": {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"},
                "status_code": status.HTTP_400_BAD_REQUEST
            }

    assessment = {
        "id": assessments_details.get("id"),
        "title": assessments_details.get("title")
    }

    result_space = space_services.get_space(request, assessments_details["space"].get("id"))
    if result_space.get("status_code") != status.HTTP_200_OK:
        return result_space

    space = {
        "id": result_space["body"].get("id"),
        "title": result_space["body"].get("title")
    }

    result["body"] = {
        "assessment": assessment,
        "space": space
    }

    if questionnaire:
        result["body"]["questionnaire"] = questionnaire

    return result


def get_path_info_with_space_id(request, space_id):
    result = dict()
    result_space = space_services.get_space(request, space_id)
    if result_space["status_code"] != status.HTTP_200_OK:
        return result_space

    space = {"id": result_space["body"]["id"],
             "title": result_space["body"]["title"]
             }
    result["body"] = {
        "space": space
    }
    result["status_code"] = status.HTTP_200_OK
    return result


def get_assessment_attribute_report(request, assessment_id, attribute_id):
    response = requests.get(ASSESSMENT_URL +
                            f'assessment-core/api/assessments/{assessment_id}/report/attributes/{attribute_id}',
                            params=request.query_params, headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
