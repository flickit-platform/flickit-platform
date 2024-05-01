from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from django.db import transaction

from account.services.space_invite_services import check_invitations_spaces


class MyOIDCAB(OIDCAuthenticationBackend):

    def create_user(self, claims):
        user_id = claims.get("sub")
        email = claims.get("email")
        first_name = claims.get('given_name', '')
        last_name = claims.get('family_name', '')
        display_name = first_name + ' ' + last_name
        with transaction.atomic():
            user = self.UserModel.objects.create_user(email, None, display_name, id=user_id)
        check_invitations_spaces(user_id=user.id)
        return user
