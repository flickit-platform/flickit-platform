from django.urls import path

from assessment.views import (projectviews, reportviews, confidence_levels_views, assessment_views,
                              advice_views, assessment_user_roles_views, maturity_level_views, questionnaire_views,
                              attributes_views,question_views)

urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
    path("<uuid:assessment_id>/calculate/", maturity_level_views.MaturityLevelCalculateApi.as_view()),
    path("<uuid:assessment_id>/questions/<int:question_id>/answer-history/",
         question_views.AnswerHistoryApi.as_view()),
    path("<uuid:assessment_id>/questionnaires/<int:questionnaire_id>/",
         questionnaire_views.LoadQuestionsWithQuestionnairesApi.as_view()),
    path("<uuid:assessment_id>/subjects/<int:subject_id>/progress/", reportviews.SubjectProgressApi.as_view()),
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
    path("<uuid:assessment_id>/export-report/attributes/<int:attribute_id>/",
         reportviews.AssessmentAttributesReportExportApi.as_view()),
    path("<uuid:assessment_id>/ai-report/attributes/<int:attribute_id>/",
         reportviews.AssessmentAttributesReportAiApi.as_view()),
    path("<uuid:assessment_id>/invite/", assessment_views.InviteUsersAssessmentsApi.as_view()),
    path("<uuid:assessment_id>/invitees/", assessment_views.InviteesAssessmentsApi.as_view()),
]
