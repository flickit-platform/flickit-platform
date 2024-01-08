from django.db import models

from baseinfo.models.assessmentkitmodels import AssessmentKit
from account.models import User


class Questionnaire(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='questionnaires')
    index = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Questionnaire'
        verbose_name_plural = "Questionnaires"
        unique_together = [('code', 'assessment_kit'), ('title', 'assessment_kit'), ('index', 'assessment_kit')]

    def __str__(self) -> str:
        return self.title


class AssessmentSubject(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='assessment_subjects',
                                       db_column="kit_id")
    questionnaires = models.ManyToManyField(Questionnaire, related_name='assessment_subjects')
    index = models.PositiveIntegerField()
    weight = models.PositiveIntegerField(default=1, null=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_subjects')
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'fak_subject'
        unique_together = [('code', 'assessment_kit'), ('title', 'assessment_kit'), ('index', 'assessment_kit')]

    def __str__(self) -> str:
        return self.title


class QualityAttribute(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_subject = models.ForeignKey(AssessmentSubject, on_delete=models.CASCADE,
                                           related_name='quality_attributes')
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='quality_attributes')
    index = models.PositiveIntegerField(null=True)
    weight = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = 'Quality Attribute'
        verbose_name_plural = "Quality Attributes"
        unique_together = [('code', 'assessment_kit'), ('title', 'assessment_kit')]

    def __str__(self) -> str:
        return self.title
