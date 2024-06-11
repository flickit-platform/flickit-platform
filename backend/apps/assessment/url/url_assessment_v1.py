from django.urls import path

from assessment.views import (projectviews, questionvalueviews, reportviews, confidence_levels_views,
                              advice_views, assessment_user_roles_views, maturity_level_views, questionnaire_views, attributes_views)

urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
    path("<uuid:assessment_id>/answer-question/", questionvalueviews.AnswerQuestionApi.as_view()),
    path("<uuid:assessment_id>/calculate/", maturity_level_views.MaturityLevelCalculateApi.as_view()),
    path("<uuid:assessment_id>/questionnaires/<int:questionnaire_id>/",
         questionnaire_views.LoadQuestionsWithQuestionnairesApi.as_view()),
    path("<uuid:assessment_id>/progress/", reportviews.AssessmentProgressApi.as_view()),
    path("<uuid:assessment_id>/report/subjects/<int:subject_id>/", reportviews.AssessmentSubjectReportApi.as_view()),
    path("<uuid:assessment_id>/subjects/<int:subject_id>/progress/", reportviews.SubjectProgressApi.as_view()),
    path("<uuid:assessment_id>/report/", reportviews.AssessmentReportApi.as_view()),
    path("<uuid:assessment_id>/report/attributes/<int:attribute_id>/",
         reportviews.AssessmentAttributesReportApi.as_view()),
    path("<uuid:assessment_id>/", projectviews.AssessmentApi.as_view()),
    path("<uuid:assessment_id>/users/",
         assessment_user_roles_views.UsersAccessToAssessmentApi.as_view()),
    path("<uuid:assessment_id>/assessment-user-roles/",
         assessment_user_roles_views.UsersRolesInAssessmentApi.as_view()),
    path("<uuid:assessment_id>/assessment-user-roles/<uuid:user_id>/",
         assessment_user_roles_views.UserRolesInAssessmentApi.as_view()),
    path("<uuid:assessment_id>/calculate-confidence/", confidence_levels_views.CalculateConfidenceApi.as_view()),
    path("<uuid:assessment_id>/advice/", advice_views.AdviceView.as_view()),
    path("<uuid:assessment_id>/attributes/<int:attribute_id>/evidences/",
         attributes_views.EvidencesOfAttributeApi.as_view()),

]
