from django.urls import path

from assessment.views import questionnaire_views, assessment_report_views, question_views, assessment_views

urlpatterns = [
    path("", assessment_views.AssessmentsApi.as_view()),
    path("<uuid:assessment_id>/", assessment_views.AssessmentApi.as_view()),
    path("<uuid:assessment_id>/answer-question/", question_views.AnswerQuestionApi.as_view()),
    path("<uuid:assessment_id>/questionnaires/", questionnaire_views.LoadQuestionnairesWithAssessmentApi.as_view()),
    path("<uuid:assessment_id>/report/", assessment_report_views.AssessmentReportApi.as_view()),
    path("<uuid:assessment_id>/report/subjects/<int:subject_id>/",
         assessment_report_views.AssessmentSubjectReportApi.as_view()),
    path("<uuid:assessment_id>/progress/", assessment_report_views.AssessmentProgressApi.as_view()),
]
