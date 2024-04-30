import requests
from assessmentplatform.settings import ASSESSMENT_URL


def check_invitations_spaces(user_id):
    response = requests.put(
        ASSESSMENT_URL + 'assessment-core/api/spaces-accept-invitations',
        json={"userId": user_id})
