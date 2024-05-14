from django.urls import path

from assessment.views import questionnaire_views, assessment_report_views, maturity_level_views

urlpatterns = [
    path("<uuid:assessment_id>/questionnaires/", questionnaire_views.LoadQuestionnairesWithAssessmentApi.as_view()),
    path("<uuid:assessment_id>/report/", assessment_report_views.AssessmentReportApi.as_view()),
    path("<uuid:assessment_id>/report/subjects/<int:subject_id>/",
         assessment_report_views.AssessmentSubjectReportApi.as_view()),
    path("<uuid:assessment_id>/progress/", assessment_report_views.AssessmentProgressApi.as_view()),
    path("<uuid:assessment_id>/calculate/", maturity_level_views.MaturityLevelCalculateApi.as_view()),

]
