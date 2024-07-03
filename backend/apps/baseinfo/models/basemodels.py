from django.db import models

from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitVersion
from account.models import User


class Questionnaire(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='questionnaires')
    index = models.PositiveIntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questionnaires',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")

    class Meta:
        db_table = 'fak_questionnaire'
        verbose_name = 'Questionnaire'
        verbose_name_plural = "Questionnaires"
        unique_together = [('code', 'kit_version'), ('title', 'kit_version'), ('index', 'kit_version')]

    def __str__(self) -> str:
        return self.title


class AssessmentSubject(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    questionnaires = models.ManyToManyField(Questionnaire, related_name='assessment_subjects',
                                            through='QuestionnaireSubject')
    index = models.PositiveIntegerField()
    weight = models.PositiveIntegerField(default=1, null=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_subjects',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    ref_num = models.UUIDField()
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='assessment_subjects')

    class Meta:
        db_table = 'fak_subject'
        unique_together = [('code', 'kit_version'), ('title', 'kit_version'), ('index', 'kit_version')]

    def __str__(self) -> str:
        return self.title


class QuestionnaireSubject(models.Model):
    subject = models.ForeignKey(AssessmentSubject, on_delete=models.CASCADE)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)

    class Meta:
        db_table = 'fak_subject_questionnaire'

    def __str__(self) -> str:
        return self.title


class QualityAttribute(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_subject = models.ForeignKey(AssessmentSubject, on_delete=models.CASCADE,
                                           related_name='quality_attributes', db_column="subject_id")
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='quality_attributes')
    index = models.PositiveIntegerField()
    weight = models.PositiveIntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quality_attributes',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    ref_num = models.UUIDField()

    class Meta:
        db_table = 'fak_attribute'
        verbose_name = 'Quality Attribute'
        verbose_name_plural = "Quality Attributes"
        unique_together = [('code', 'kit_version'), ('title', 'kit_version'), ('code', 'assessment_subject'),
                           ('index', 'assessment_subject')]

    def __str__(self) -> str:
        return self.title
