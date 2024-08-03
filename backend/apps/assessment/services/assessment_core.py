import requests
from rest_framework import status

from account.services import space_services
from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT
from baseinfo.models.basemodels import Questionnaire
from baseinfo.services import assessmentkitservice


def get_subject_progress(request, assessment_id, subject_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/subjects/{subject_id}/progress',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_path_info_with_assessment_id(request, assessments_details):
    result = dict()
    questionnaire = None
    kit = assessmentkitservice.load_assessment_kit(assessments_details["kit"]["id"])
    if "questionnaire_id" in request.query_params:
        if Questionnaire.objects.filter(id=request.query_params["questionnaire_id"]).filter(
                kit_version=kit.kit_version_id).exists():
            questionnaire_object = Questionnaire.objects.get(id=request.query_params["questionnaire_id"])
            questionnaire = {"id": questionnaire_object.id,
                             "title": questionnaire_object.title
                             }
        else:
            result["Success"] = False
            result["body"] = {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"}
            result["status_code"] = status.HTTP_400_BAD_REQUEST
            return result

    assessment = {"id": assessments_details["id"],
                  "title": assessments_details["title"]
                  }
    result_space = space_services.get_space(request, assessments_details["space"]["id"])
    if result_space["status_code"] != status.HTTP_200_OK:
        return result_space

    space = {"id": result_space["body"]["id"],
             "title": result_space["body"]["title"]
             }

    if questionnaire is None:
        result["body"] = {"assessment": assessment,
                          "space": space,
                          }
    else:
        result["body"] = {"assessment": assessment,
                          "space": space,
                          "questionnaire": questionnaire
                          }
    result["status_code"] = status.HTTP_200_OK
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
