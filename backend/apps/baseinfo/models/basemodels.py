from django.db import models

from baseinfo.models.profilemodels import AssessmentProfile

class Questionnaire(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_profile = models.ForeignKey(AssessmentProfile, on_delete=models.CASCADE, related_name='questionnaires')
    index = models.PositiveIntegerField(null=True)

    class Meta:
        verbose_name = 'Questionnaire'
        verbose_name_plural = "Questionnaires"

    def __str__(self) -> str:
        return self.title

class AssessmentSubject(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_profile = models.ForeignKey(AssessmentProfile, on_delete=models.CASCADE, related_name='assessment_subjects')
    questionnaires = models.ManyToManyField(Questionnaire, related_name = 'assessment_subjects')
    index = models.PositiveIntegerField(null=True)

    class Meta:
        verbose_name = 'Assessment Subject'
        verbose_name_plural = "Assessment Subjects"

    def __str__(self) -> str:
        return self.title


class QualityAttribute(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_subject = models.ForeignKey(AssessmentSubject, on_delete=models.CASCADE)
    index = models.PositiveIntegerField(null=True)

    class Meta:
        verbose_name = 'Quality Attribute'
        verbose_name_plural = "Quality Attributes"

    def __str__(self) -> str:
        return self.title
