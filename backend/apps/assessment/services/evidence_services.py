import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL
from baseinfo.models.questionmodels import Question
from account.models import User


def add_evidences(assessments_details, validated_data, user_id):
    result = dict()
    if not Question.objects.filter(id=validated_data["question_id"]).filter(
            questionnaire__assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'question_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    data = {"description": validated_data["description"],
            "createdById": user_id,
            "assessmentId": assessments_details["assessmentId"],
            "questionId": validated_data["question_id"],
            }
    response = requests.post(
        ASSESSMENT_URL + 'assessment-core/api/evidences', json=data)
    response_body = response.json()

    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_list_evidences(assessments_details, question_id, request):
    result = dict()
    if not Question.objects.filter(id=question_id).filter(
            questionnaire__assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'question_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    params = {"questionId": question_id,
              "assessmentId": assessments_details["assessmentId"]
              }
    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/evidences', params=params)
    response_body = response.json()
    users_id = list()
    if response.status_code == status.HTTP_200_OK:
        for item in response_body["items"]:
            users_id.append(item["createdById"])
        users = User.objects.filter(id__in=users_id)
        if response.status_code == status.HTTP_200_OK:
            for i in range(len(response_body["items"])):
                user = users.get(id=response_body["items"][i].pop("createdById"))
                response_body["items"][i]["created_by"] = {"id": user.id, "display_name": user.display_name}
                response_body["items"][i]["last_modification_date"] = response_body["items"][i].pop(
                    "lastModificationTime")

    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result
