from django.urls import path

from baseinfo.views import assessmentkitviews, commonviews

urlpatterns = [
        path("<str:assessment_kit_id>/info/",assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()),
        path("<str:assessment_kit_id>/stats/",assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()),
        path("<str:assessment_kit_id>/",assessmentkitviews.EditAssessmentKitInfoApi.as_view()),
        path("<str:assessment_kit_id>/maturity-levels/",assessmentkitviews.LoadMaturityLevelApi.as_view()),
        path("<str:assessment_kit_id>/details/", assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()),
        path("<str:assessment_kit_id>/details/subjects/<str:subject_id>/", commonviews.LoadAssessmentSubjectDetailsApi.as_view()),
        path("<str:assessment_kit_id>/details/attributes/<str:attribute_id>/", commonviews.LoadQualityAttributesDetailsApi.as_view()),
        path("<str:assessment_kit_id>/details/attributes/<str:attribute_id>/maturity-levels/<str:maturity_level_id>/", commonviews.LoadMaturityLevelsDetailsApi.as_view() ),
        path("<str:assessment_kit_id>/details/questionnaires/<str:questionnaire_id>/", commonviews.LoadQuestionnairesDetailsApi.as_view()),
        path("<str:assessment_kit_id>/details/questions/<str:question_id>/", commonviews.LoadQuestionDetailsApi.as_view()),
        path("<str:assessment_kit_id>/file/", assessmentkitviews.LoadAssessmentKitFileApi.as_view()),
            ]