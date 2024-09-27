from django.urls import path

from baseinfo.views import assessment_kit_views

urlpatterns = [
    path("", assessment_kit_views.AssessmentKitsApi.as_view()),
    path("<str:assessment_kit_id>/stats/", assessment_kit_views.AssessmentKitStateApi.as_view()),
    path("<str:assessment_kit_id>/info/", assessment_kit_views.AssessmentKitInfoApi.as_view()),
    path("<str:assessment_kit_id>/", assessment_kit_views.AssessmentKitApi.as_view()),
    path("<str:assessment_kit_id>/details/", assessment_kit_views.AssessmentKitDetailsApi.as_view()),
    path("<str:assessment_kit_id>/details/subjects/<str:subject_id>/",
         assessment_kit_views.AssessmentKitDetailsSubjectApi.as_view()),
    path("<str:assessment_kit_id>/details/attributes/<str:attribute_id>/",
         assessment_kit_views.AssessmentKitDetailsAttributesApi.as_view()),
    path("<str:assessment_kit_id>/details/questionnaires/<str:questionnaire_id>/",
         assessment_kit_views.AssessmentKitDetailsQuestionnairesApi.as_view()),
    path("<str:assessment_kit_id>/details/questions/<str:question_id>/",
         assessment_kit_views.AssessmentKitDetailsQuestionApi.as_view()),
    path("<str:assessment_kit_id>/details/attributes/<str:attribute_id>/maturity-levels/<str:maturity_level_id>/",
         assessment_kit_views.AssessmentKitDetailsMaturityLevelsAsAttributeApi.as_view()),
    path("<str:assessment_kit_id>/like/", assessment_kit_views.AssessmentKitLikeApi.as_view()),

]
