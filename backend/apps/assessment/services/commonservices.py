import requests
import json

from assessmentplatform.settings import ASSESSMENT_URL


def load_color():
    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessment-colors').json()
    response['default_color'] = response.pop('defaultColor')
    return response
