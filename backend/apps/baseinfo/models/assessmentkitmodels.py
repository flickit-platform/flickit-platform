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


class AssessmentKitDsl(models.Model):
    assessment_kit = models.OneToOneField(AssessmentKit, on_delete=models.SET_NULL, related_name='dsl', null=True)
    dsl_path = models.CharField(max_length=200)
    creation_time = models.DateTimeField(auto_now_add=True)
    json_path = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dsl_owner',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING,
                                         db_column="last_modified_by")
    last_modification_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fak_kit_dsl'


class AssessmentKitTag(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100, unique=True)
    assessment_kits = models.ManyToManyField(AssessmentKit, through='AssessmentKitTagRelation', related_name='tags',
                                             through_fields=("tag", "assessment_kit"))

    class Meta:
        db_table = 'fak_kit_tag'
        verbose_name = 'Assessment Kit Tag'
        verbose_name_plural = "Assessment Kit Tags"

    def __str__(self) -> str:
        return self.title


class AssessmentKitTagRelation(models.Model):
    tag = models.ForeignKey(AssessmentKitTag, on_delete=models.CASCADE, db_column='tag_id')
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, db_column="kit_id")

    class Meta:
        db_table = 'fak_kit_tag_relation'
        unique_together = ('tag', 'assessment_kit')


class AssessmentKitLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes', primary_key=True, unique=True)
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='likes',
                                       db_column="kit_id")

    class Meta:
        db_table = 'fak_kit_like'
        unique_together = [('user', 'assessment_kit')]


class MaturityLevel(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    value = models.PositiveSmallIntegerField()
    index = models.PositiveSmallIntegerField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maturity_levels',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    ref_num = models.UUIDField()
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='maturity_levels')

    class Meta:
        db_table = 'fak_maturity_level'
        verbose_name = 'MaturityLevel'
        verbose_name_plural = "MaturityLevels"
        unique_together = [('code', 'kit_version'), ('title', 'kit_version'), ('value', 'kit_version'),
                           ('index', 'kit_version')]


class LevelCompetence(models.Model):
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='level_competences',
                                       db_column='affected_level_id')
    value = models.PositiveIntegerField()
    maturity_level_competence = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE,
                                                  db_column='effective_level_id')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='level_competences',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")

    class Meta:
        db_table = 'fak_level_competence'
