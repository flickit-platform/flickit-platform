from django.urls import path

from baseinfo.views import (assessmentkitviews, commonviews, update_assessment_kit_views, user_access_views,
                            importassessmentkitviews, assessment_kit_views)

urlpatterns = [
    path("options/search/", assessment_kit_views.AssessmentKitsSearchApi.as_view()),
    path("upload-dsl/", importassessmentkitviews.ImportDslFileView.as_view()),
    path("create-by-dsl/", importassessmentkitviews.CreateAssessmentKitByDsl.as_view()),
    path("<str:assessment_kit_id>/", assessmentkitviews.EditAssessmentKitInfoApi.as_view()),
    path("<str:assessment_kit_id>/update-by-dsl/", update_assessment_kit_views.AssessmentKitUpdateApi.as_view()),
    path("<str:assessment_kit_id>/users/", user_access_views.AssessmentKitUsersAccessApi.as_view()),
    path("<str:assessment_kit_id>/users/<uuid:user_id>/",
         user_access_views.DeleteUserAccessToAssessmentKitApi.as_view()),
    path("<str:assessment_kit_id>/min-info/", user_access_views.LoadAssessmentKitMinimalInfoApi.as_view()),
    path("<str:assessment_kit_id>/dsl-download-link/", assessmentkitviews.LoadAssessmentKitFileApi.as_view()),

]
