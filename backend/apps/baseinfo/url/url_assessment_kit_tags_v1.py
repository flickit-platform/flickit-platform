from django.urls import path

from baseinfo.views import assessment_kit_tags_views

urlpatterns = [
    path("", assessment_kit_tags_views.AssessmentKitTagsApi.as_view()),
]
