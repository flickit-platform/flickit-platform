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
