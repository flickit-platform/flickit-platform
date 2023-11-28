from django.urls import path
from assessment.views import projectviews, questionvalueviews, questionaryviews, reportviews, confidence_levels_views
urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
    path("<uuid:assessment_id>/answer-question/", questionvalueviews.AnswerQuestionApi.as_view()),
    path("<uuid:assessment_id>/calculate/", questionvalueviews.MaturityLevelCalculateApi.as_view()),
    path("<uuid:assessment_id>/<int:questionnaire_id>/", questionvalueviews.LoadQuestionnaireAnswerApi.as_view()),
    path("<uuid:assessment_id>/questionnaires/", questionaryviews.LoadQuestionnairesWithAssessmentApi.as_view()),
    path("<uuid:assessment_id>/progress/", reportviews.AssessmentProgressApi.as_view()),
    path("<uuid:assessment_id>/report/subjects/<int:subject_id>/", reportviews.AssessmentSubjectReportApi.as_view()),
    path("<uuid:assessment_id>/subjects/<int:subject_id>/progress/", reportviews.SubjectProgressApi.as_view()),
    path("<uuid:assessment_id>/report/", reportviews.AssessmentReportApi.as_view()),
    path("<uuid:assessment_id>/", projectviews.AssessmentApi.as_view()),
    path("<uuid:assessment_id>/calculate-confidence/", confidence_levels_views.CalculateConfidenceApi.as_view()),

]
