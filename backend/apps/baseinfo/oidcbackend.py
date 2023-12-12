from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from account.services import spaceservices
from django.db import transaction

class MyOIDCAB(OIDCAuthenticationBackend):

    @transaction.atomic()
    def create_user(self, claims):
        user_id = claims.get("sub")
        email = claims.get("email")
        first_name = claims.get('given_name', '')
        last_name = claims.get('family_name', '')
        display_name = first_name + ' ' + last_name
        user = self.UserModel.objects.create_user(email, None, display_name, id=user_id)
        spaceservices.create_default_space(user)
        return user


