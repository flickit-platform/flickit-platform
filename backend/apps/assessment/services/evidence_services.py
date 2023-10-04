import requests
from rest_framework import status

from assessmentplatform.settings import ASSESSMENT_URL
from baseinfo.models.questionmodels import Question




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
        ASSESSMENT_URL + f'assessment-core/api/evidences', json=data)
    response_body = response.json()

    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result
