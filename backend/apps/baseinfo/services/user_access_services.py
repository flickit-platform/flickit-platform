import requests
from assessmentplatform.settings import ASSESSMENT_URL
from rest_framework import status


def get_assessment_kit_users(assessment_kit_id, authorization_header, query_params):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/users',
                            headers={"Authorization": authorization_header},
                            params=query_params
                            )
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def add_user_in_assessment_kit(assessment_kit_id, authorization_header, request_body):
    result = check_email_exists(request_body["email"])
    if not result["Success"]:
        return result
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/users',
                             headers={"Authorization": authorization_header},
                             json={"userId": result["body"]["id"]}
                             )
    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def delete_user_in_assessment_kit(assessment_kit_id, authorization_header, user_id):
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/users/{user_id}',
        headers={"Authorization": authorization_header}
        )
    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def check_email_exists(email):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/users/email/{email}')
    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "body": response.json(), "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def get_assessment_kit_info_minimal(assessment_kit_id):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/min-info',
                            )
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
