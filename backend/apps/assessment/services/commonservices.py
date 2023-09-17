import requests
import json

from assessmentplatform.settings import ASSESSMENT_URL
from account.models import Space
from baseinfo.models.basemodels import Questionnaire
from assessment.models import AssessmentProject

from common.abstractservices import load_model


def loadBreadcrumbInfo(data):
    MODEL_MAP = {
        'space_id': Space,
        'assessment_id': AssessmentProject,
        'questionnaire_id': Questionnaire,
    }
    content = {}
    for key in ['space_id', 'assessment_id', 'questionnaire_id']:
        id_value = data.get(key)
        if id_value:
            model_class = MODEL_MAP[key]
            content[key] = load_model(model_class, id_value).title
    return content


def load_color():
    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessment-colors').json()
    response['results'] = response.pop('items')
    return response

