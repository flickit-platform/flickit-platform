from django.db import models

from baseinfo.models.basemodels import Questionnaire, QualityAttribute
from baseinfo.models.assessmentkitmodels import MaturityLevel, AssessmentKit, AssessmentKitVersion
from account.models import User


class QuestionImpact(models.Model):
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='question_impacts',
                                       null=True)
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='question_impacts')
    quality_attribute = models.ForeignKey('QualityAttribute', on_delete=models.CASCADE, related_name='question_impacts',
                                          db_column='attribute_id')
    weight = models.PositiveIntegerField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='question_impacts',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")

    class Meta:
        db_table = 'fak_question_impact'


class OptionValue(models.Model):
    option = models.ForeignKey('AnswerTemplate', on_delete=models.CASCADE, related_name='option_values')
    value = models.DecimalField(max_digits=3, decimal_places=2)
    question_impact = models.ForeignKey(QuestionImpact, on_delete=models.CASCADE, related_name='option_values')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='OptionValue',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    ref_num = models.UUIDField()

    class Meta:
        db_table = 'fak_answer_option_impact'


class AnswerTemplate(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='answer_templates')
    caption = models.CharField(max_length=255, db_column="title")
    index = models.PositiveIntegerField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answer_templates',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='answer_templates')


    class Meta:
        db_table = 'fak_answer_option'
        verbose_name = 'Answer Template'
        verbose_name_plural = "Answer Templates"
        unique_together = [('index', 'question')]


class Question(models.Model):
    code = models.CharField(max_length=50)
    title = models.TextField()
    description = models.TextField(null=True, db_column="hint")
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True, db_column="last_modification_time")
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    quality_attributes = models.ManyToManyField(QualityAttribute, through=QuestionImpact)
    index = models.IntegerField()
    may_not_be_applicable = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions',
                                   db_column="created_by")
    last_modified_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="last_modified_by")
    kit_version = models.ForeignKey(AssessmentKitVersion, on_delete=models.CASCADE, related_name='questions')

    ref_num = models.UUIDField()

    class Meta:
        db_table = 'fak_question'
        verbose_name = 'Question'
        verbose_name_plural = "Questions"
        unique_together = [('code', 'questionnaire')]

    def __str__(self) -> str:
        return self.title
