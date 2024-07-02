from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from account.services.utils_services import create_new_code_number
from common.validators import validate_file_size

from uuid import uuid4


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, display_name, **extra_fields):
        if not email:
            raise ValueError('Email must be provided')

        user = self.model(
            email=self.normalize_email(email),
            display_name=display_name,
            **extra_fields
        )

        if password is None:
            user.set_unusable_password()

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
    code = models.CharField(max_length=50, unique=True, default=create_new_code_number)
    title = models.CharField(max_length=100)
    users = models.ManyToManyField('User', through='UserAccess', related_name='spaces',
                                   through_fields=('space', 'user'))
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column='last_modification_time')
    owner = models.ForeignKey('User', on_delete=models.PROTECT, related_name='spaces_owner')
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='spaces_created',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey('User', on_delete=models.DO_NOTHING, db_column="last_modified_by")

    class Meta:
        db_table = 'fau_space'


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid4)
    email = models.EmailField(unique=True, max_length=254,
                              error_messages={'unique': "A user with this email address already exists."})
    is_active = models.BooleanField(default=True)
    display_name = models.CharField(max_length=255)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    picture = models.ImageField(upload_to='user/images', null=True, validators=[validate_file_size])
    bio = models.CharField(null=True, max_length=400)
    linkedin = models.URLField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']

    class Meta:
        db_table = 'fau_user'


class SpaceInvitee(models.Model):
    space = models.ForeignKey('Space', on_delete=models.CASCADE, related_name='invitees')
    email = models.EmailField(unique=True, max_length=254)
    expiration_date = models.DateTimeField()
    creation_time = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='space_invitee',
                                   db_column="created_by")

    class Meta:
        db_table = 'fau_space_invitee'
        unique_together = ('space', 'email')


class UserAccess(models.Model):
    space = models.ForeignKey('Space', on_delete=models.CASCADE, primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    created_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='created_space_user_access',
                                   db_column="created_by")
    creation_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'fau_space_user_access'
        unique_together = ('space', 'user')
