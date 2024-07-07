import requests
from assessmentplatform.settings import DSL_PARSER_URL_SERVICE, ASSESSMENT_URL
from baseinfo.models.assessmentkitmodels import ExpertGroup
from rest_framework import status


def upload_dsl_assessment(data, request):
    data = request.data
    file = data.pop('dslFile')
    if ExpertGroup.objects.get(id=data['expert_group_id']).owner_id != request.user.id:
        return {"Success": False, "body": {'message': 'You do not have permission to perform this action.'},
                "status_code": status.HTTP_403_FORBIDDEN}
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/upload-dsl',
                             data=data,
                             files={'dslFile': (file.name, file, file.content_type)},
                             headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def download_dsl_assessment(assessment_kit_id, request):
    response = requests.get(ASSESSMENT_URL + f'assessment-core/api/assessment-kits/{assessment_kit_id}/dsl-download-link',
                            headers={'Authorization': request.headers['Authorization']})
    return {"Success": False, "body": response.json(), "status_code": response.status_code}
