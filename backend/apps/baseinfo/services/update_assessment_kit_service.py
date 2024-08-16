import requests
from assessmentplatform.settings import ASSESSMENT_URL
from rest_framework import status


def assessment_core_dsl_update(request, assessment_kit_id):
    response = requests.put(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/update-by-dsl',
                            json=request.data, headers={'Authorization': request.headers['Authorization']})

    if response.status_code == status.HTTP_200_OK:
        return {"Success": True, "body": {"message": "The assessment kit updated successfully. "},
                "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
