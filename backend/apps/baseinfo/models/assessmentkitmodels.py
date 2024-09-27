from django.db import models

from common.validators import validate_file_size

from account.models import User


class ExpertGroup(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100, unique=True, db_column="title")
    bio = models.CharField(max_length=200)
    about = models.TextField()
    website = models.CharField(max_length=200, null=True, blank=True)
    picture = models.ImageField(upload_to='expertgroup/images', null=True, validators=[validate_file_size])
    users = models.ManyToManyField(User, through='ExpertGroupAccess', through_fields=("expert_group", "user"),
                                   related_name='expert_groups')
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name='expert_groups_owner')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expert_groups_created_by',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    deleted = models.BooleanField(default=True, db_column="deleted")
    deletion_time = models.BooleanField(default=0, db_column="deletion_time")

    class Meta:
        permissions = [
            ('manage_expert_group', 'Manage Expert Groups')
        ]
        db_table = 'fau_expert_group'


class ExpertGroupAccess(models.Model):
    expert_group = models.ForeignKey('ExpertGroup', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    invite_token = models.UUIDField(null=True)
    status = models.SmallIntegerField(default=1)
    invite_date = models.DateTimeField(null=True)
    invite_expiration_date = models.DateTimeField(null=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expert_groups_access_created_by',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by",
                                         related_name='expert_groups_access_last_modified_by')
    deleted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('expert_group', 'user')
        db_table = 'fau_expert_group_user_access'


class AssessmentKitVersion(models.Model):
    status_types = (
        (0, "ACTIVE"),
        (1, "UPDATING"),
        (2, "ARCHIVE"),
    )
    assessment_kit = models.ForeignKey('AssessmentKit', on_delete=models.CASCADE, db_column="kit_id")
    status = models.SmallIntegerField(choices=status_types)

    class Meta:
        db_table = 'fak_kit_version'


class AssessmentKit(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100, unique=True)
    summary = models.TextField()
    about = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    expert_group = models.ForeignKey(ExpertGroup, on_delete=models.CASCADE, related_name='assessmentkits')
    is_active = models.BooleanField(default=False, db_column="published")
    is_private = models.BooleanField(default=False)
    users = models.ManyToManyField(User, through='AssessmentKitAccess', related_name='assessment_kit')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_kit_owner',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    last_major_modification_time = models.DateTimeField(auto_now_add=True)
    kit_version_id = models.BigIntegerField()

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = 'fak_assessment_kit'
        verbose_name = "Assessment Kit"
        verbose_name_plural = "Assessment Kits"
        ordering = ['title']


class AssessmentKitAccess(models.Model):
    assessment_kit = models.ForeignKey('AssessmentKit', on_delete=models.CASCADE, db_column="kit_id")
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column="user_id")

    class Meta:
        db_table = 'fak_kit_user_access'
        unique_together = ('assessment_kit', 'user')


