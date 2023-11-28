import requests

from assessmentplatform.settings import DSL_PARSER_URL_SERVICE, ASSESSMENT_URL


def get_confidence_levels_in_assessment_core():
    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/confidence-levels',
                            )
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_confidence_levels_calculate_in_assessment_core(assessment_id):
    response = requests.post(ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/calculate-confidence',
                            )
    return {"Success": True, "body": response.json(), "status_code": response.status_code}
