import requests
from assessmentplatform.settings import ASSESSMENT_URL


def tenant_info():
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/tenant/info')
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def tenant_logo():
    response = requests.get(
        ASSESSMENT_URL + 'assessment-core/api/tenant/logo')
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
