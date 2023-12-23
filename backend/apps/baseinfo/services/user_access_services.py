import requests
from assessmentplatform.settings import ASSESSMENT_URL


def get_assessment_kit_users(assessment_kit_id, authorization_header, query_params):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/users',
                            headers={"Authorization": authorization_header},
                            params=query_params
                            )
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
