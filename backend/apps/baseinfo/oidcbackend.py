from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from django.core.exceptions import SuspiciousOperation

from account.services.oauth_service import get_user_object, create_user
from account.services.space_invite_services import check_invitations_spaces
import logging

LOGGER = logging.getLogger(__name__)

class MyOIDCAB(OIDCAuthenticationBackend):

    def create_user(self, claims):
        user_id = claims.get("sub")
        email = claims.get("email")
        first_name = claims.get('given_name', '')
        last_name = claims.get('family_name', '')
        display_name = first_name + ' ' + last_name
        user_id = create_user(email, display_name, user_id)
        check_invitations_spaces(user_id=user_id)
        user = get_user_object(claims)
        return user

    def get_or_create_user(self, access_token, id_token, payload):
        """Returns a User instance if 1 user is found. Creates a user if not found
        and configured to do so. Returns nothing if multiple users are matched."""

        user_info = self.get_userinfo(access_token, id_token, payload)

        claims_verified = self.verify_claims(user_info)
        if not claims_verified:
            msg = "Claims verification failed"
            raise SuspiciousOperation(msg)

        # email based filtering
        user = get_user_object(user_info)
        if user is not None:
            return user
        elif self.get_settings("OIDC_CREATE_USER", True):
            user = self.create_user(user_info)
            return user
        else:
            LOGGER.debug(
                "Login failed: No user with %s found, and " "OIDC_CREATE_USER is False",
                self.describe_user_by_claims(user_info),
            )
            return None
