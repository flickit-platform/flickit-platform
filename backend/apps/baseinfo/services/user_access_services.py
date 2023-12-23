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
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/users',
                             headers={"Authorization": authorization_header},
                             json=request_body
                             )
    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}

