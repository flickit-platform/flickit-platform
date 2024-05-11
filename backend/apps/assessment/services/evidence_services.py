import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL
from baseinfo.models.questionmodels import Question
from account.models import User
from baseinfo.services import assessmentkitservice


def add_evidences(assessments_details, validated_data, user_id, authorization_header):
    result = dict()
    kit = assessmentkitservice.load_assessment_kit(assessments_details["kitId"])
    if not Question.objects.filter(id=validated_data["question_id"]).filter(
            questionnaire__kit_version=kit.kit_version_id).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'question_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    data = {"description": validated_data["description"],
            "assessmentId": assessments_details["assessmentId"],
            "questionId": validated_data["question_id"],
            }
    response = requests.post(
        ASSESSMENT_URL + 'assessment-core/api/evidences', json=data, headers={"Authorization": authorization_header})
    response_body = response.json()

    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_list_evidences(request):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/evidences',
        params=request.query_params,
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def edit_evidence(validated_data, evidence_id, authorization_header):
    result = dict()
    data = {
        "description": validated_data["description"]
    }
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/evidences/{evidence_id}', json=data,
        headers={"Authorization": authorization_header}
    )
    response_body = response.json()

    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def delete_evidence(evidence_id):
    result = dict()

    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/evidences/{evidence_id}')

    result["Success"] = True
    result["body"] = None
    result["status_code"] = response.status_code
    return result
