from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitTag
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.questionmodels import AnswerTemplate, QuestionImpact, Question, OptionValue


@admin.register(AssessmentKit)
class AssessmentKitAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    search_fields = ['code', 'title']
    list_display = ['code', 'title']
    list_editable = ['title']
    list_per_page = 10


@admin.register(AssessmentSubject)
class AssessmentSubjectAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    autocomplete_fields = ['questionnaires']
    search_fields = ['code', 'title', 'assessment_kit']
    fields = ['code', 'title', 'description', 'assessment_kit', 'questionnaires', 'index']
    list_display = ['code', 'title', 'subject_questionnaires', 'assessment_kit']
    list_editable = ['title']
    list_per_page = 10

    def subject_questionnaires(self, obj):
        return "\n".join([att.title for att in obj.questionnaires.all()])


@admin.register(Questionnaire)
class QuestionnaireAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    search_fields = ['code', 'title', 'assessment_kit']
    fields = ['code', 'title', 'description', 'assessment_kit', 'index']
    list_display = ['code', 'title', 'assessment_kit']
    list_editable = ['title']
    list_per_page = 10


@admin.register(QuestionImpact)
class QuestionImpactAdmin(admin.ModelAdmin):
    fields = ['level', 'quality_attribute']
    list_display = ['quality_attribute', 'option_values', 'question']
    autocomplete_fields = ['quality_attribute']
    extra = 0

    def option_values(self, obj):
        return "\n".join(
            ['(' + str(option_value.option.index) + ', ' + str(option_value.value) + ')' for option_value in
             obj.option_values.all()])


# class OptionValueFormInline(admin.TabularInline):
#     model = OptionValue
#     # fields = ['option', 'value']
#     # extra = 0

# def option_valuess(self, obj):
#     return "\n".join([option_value.value for option_value in obj.option_values.all()])


class QuestionImpactFormInline(admin.TabularInline):
    model = QuestionImpact
    fields = ['quality_attribute']
    list_display = ['quality_attribute']
    autocomplete_fields = ['quality_attribute']
    extra = 0


class AnswerTemplateFormInline(admin.TabularInline):
    model = AnswerTemplate
    fields = ['caption', 'index']
    extra = 0


@admin.register(Question)
class QuestionAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    autocomplete_fields = ['questionnaire']
    search_fields = ['title']
    list_filter = ['questionnaire', 'last_modification_date']
    list_display = ['title', 'questionnaire', 'quality_attributes_question']
    list_per_page = 10
    inlines = [QuestionImpactFormInline, AnswerTemplateFormInline]

    def quality_attributes_question(self, obj):
        return "\n".join([att.title for att in obj.quality_attributes.all()])


@admin.register(QualityAttribute)
class QualityAttributeAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    fields = ['code', 'title', 'description', 'assessment_subject', 'index']
    search_fields = ['title', 'assessment_subject']
    list_display = ['code', 'title', 'assessment_subject']
    list_editable = ['title']
    list_per_page = 10


@admin.register(AssessmentKitTag)
class TagAdmin(admin.ModelAdmin):
    fields = ['code', 'title']
    search_fields = ['title', 'code']
    list_display = ['code', 'title', 'assessment_kits_tag']
    list_editable = ['title']
    list_per_page = 10

    def assessment_kits_tag(self, obj):
        return "\n".join([assessment_kit.title for assessment_kit in obj.assessmentkits.all()])
