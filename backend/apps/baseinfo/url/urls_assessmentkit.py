from django.urls import path

from baseinfo.views import assessmentkitviews

urlpatterns = [
        path("<str:assessment_kit_id>/info/",assessmentkitviews.LoadAssessmentKitInfoEditableApi.as_view()),
        path("<str:assessment_kit_id>/stats/",assessmentkitviews.LoadAssessmentKitInfoStatisticalApi.as_view()),
        path("<str:assessment_kit_id>/",assessmentkitviews.EditAssessmentKitInfoApi.as_view()),
        path("<str:assessment_kit_id>/maturity-levels/",assessmentkitviews.LoadMaturityLevelApi.as_view()),
        path("<str:assessment_kit_id>/details/", assessmentkitviews.LoadAssessmentKitDetailsApi.as_view()),
            ]