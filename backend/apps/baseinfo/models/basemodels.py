from django.db import models

from baseinfo.models.assessmentkitmodels import AssessmentKit

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
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='assessment_subjects')
    questionnaires = models.ManyToManyField(Questionnaire, related_name = 'assessment_subjects')
    index = models.PositiveIntegerField()

    class Meta:
        verbose_name = 'Assessment Subject'
        verbose_name_plural = "Assessment Subjects"
        unique_together = [('code', 'assessment_kit'), ('title', 'assessment_kit'), ('index', 'assessment_kit')]

    def __str__(self) -> str:
        return self.title


class QualityAttribute(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_subject = models.ForeignKey(AssessmentSubject, on_delete=models.CASCADE, related_name='quality_attributes')
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.CASCADE, related_name='quality_attributes')
    index = models.PositiveIntegerField(null=True)
    weight = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = 'Quality Attribute'
        verbose_name_plural = "Quality Attributes"
        unique_together = [('code', 'assessment_kit'), ('title', 'assessment_kit')]

    def __str__(self) -> str:
        return self.title
