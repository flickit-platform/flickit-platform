from ..models import User



def load_user_by_email(email) -> User:
    try:
        return User.objects.filter(email=email).first()
    except User.DoesNotExist:
        return None