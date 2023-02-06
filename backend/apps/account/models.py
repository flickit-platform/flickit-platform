from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, display_name, **extra_fields):
        if not email:
            raise ValueError('Email must be provided')
        if not password:
            raise ValueError('password is not provided')
        
        user = self.model(
            email = self.normalize_email(email),
            display_name = display_name,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, display_name, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, display_name, **extra_fields)

    def create_superuser(self, email, password, display_name, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, display_name, **extra_fields)


class Space(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100, unique=True)
    users = models.ManyToManyField('User', through='UserAccess', related_name='spaces')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('User', on_delete=models.PROTECT, null=True)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=254, error_messages={'unique':"A user with this email address already exists."})
    is_active = models.BooleanField(default=True)
    display_name = models.CharField(max_length=255)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    current_space = models.ForeignKey(Space, on_delete=models.PROTECT, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']

class UserAccess(models.Model):
    space = models.ForeignKey('Space', on_delete=models.CASCADE)
    user =  models.ForeignKey('User', on_delete=models.CASCADE, null=True)
    invite_email = models.EmailField(null = True)
    invite_expiration_date = models.DateTimeField(null=True)

    class Meta:
        unique_together = ('space', 'user')