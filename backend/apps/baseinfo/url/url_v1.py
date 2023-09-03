from django.urls import path

from baseinfo.views import assessmentkitviews, commonviews

urlpatterns = [
        path("assessment-kits/<str:assessment_kit_id>/info/",assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()),
        path("assessment-kits/<str:assessment_kit_id>/stats/",assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()),
        path("assessment-kits/<str:assessment_kit_id>/",assessmentkitviews.EditAssessmentKitInfoApi.as_view()),
        path("assessment-kits/<str:assessment_kit_id>/maturity-levels/",assessmentkitviews.LoadMaturityLevelApi.as_view()),
        path("assessment-kits/<str:assessment_kit_id>/details/", assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()),
        path("assessment-kits/<str:assessment_kit_id>/details/subjects/<str:subject_id>/", commonviews.LoadAssessmentSubjectDetailsApi.as_view()),
            ]