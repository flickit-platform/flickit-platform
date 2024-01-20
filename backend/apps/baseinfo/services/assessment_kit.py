import requests
from assessmentplatform.settings import ASSESSMENT_URL
from baseinfo.models.assessmentkitmodels import ExpertGroup
from rest_framework import status


def create_assessment_by_dsl(data, request):
    if ExpertGroup.objects.get(id=data['expertGroupId']).owner_id != request.user.id:
        return {"Success": False, "body": {'message': 'You do not have permission to perform this action.'},
                "status_code": status.HTTP_403_FORBIDDEN}
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/create-by-dsl', json=data,
                             headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
