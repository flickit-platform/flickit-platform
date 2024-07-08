import requests

from account.models import User
from assessmentplatform.settings import ASSESSMENT_URL


def get_user_by_email(email):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/users/email/{email}')
    if response.status_code == 200:
        return {"Success": True, "body": response.json(), "status_code": response.status_code}
    return {"Success": False, "body": response.json(), "status_code": response.status_code}


def change_case(string: str):
    return ''.join(['_' + i.lower() if i.isupper()
                    else i for i in string]).lstrip('_')


def json_obj_change_case(obj: dict):
    for i in obj:
        obj[change_case(i)] = obj.pop(i)
    obj["is_superuser"] = obj.pop("is_super_user")
    return obj


def get_user_object(claims):
    email = claims.get("email")
    user_info = get_user_by_email(email)
    if user_info['Success']:
        user_info = json_obj_change_case(user_info['body'])
        user = User(**user_info)
        return user
    else:
        return None


def create_user_service(email, display_name, user_id):
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/users',
        json={"id": user_id, "email": email, "displayName": display_name})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def create_user(email, display_name, user_id):
    result = create_user_service(email, display_name, user_id)
    return result["body"]["userId"]
