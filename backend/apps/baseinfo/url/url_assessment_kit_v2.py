from django.urls import path

from baseinfo.views import assessment_kit_views

urlpatterns = [
    path("<str:assessment_kit_id>/stats/", assessment_kit_views.AssessmentKitStateView.as_view()),
    path("<str:assessment_kit_id>/info/", assessment_kit_views.AssessmentKitInfoView.as_view()),
    path("<str:assessment_kit_id>/", assessment_kit_views.AssessmentKitView.as_view()),
    path("<str:assessment_kit_id>/details/", assessment_kit_views.AssessmentKitDetailsView.as_view()),

]
