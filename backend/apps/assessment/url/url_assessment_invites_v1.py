from django.urls import path
from assessment.views import assessment_views
urlpatterns = [
    path("<uuid:invite_id>", assessment_views.AssessmentInvitesApi.as_view()),
]


