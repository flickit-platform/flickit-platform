from django.urls import path

from baseinfo.views import assessment_kit_views

urlpatterns = [
    path("<str:assessment_kit_id>/stats/", assessment_kit_views.AssessmentKitStateView.as_view()),
    path("<str:assessment_kit_id>/info/", assessment_kit_views.AssessmentKitInfoView.as_view()),

]
