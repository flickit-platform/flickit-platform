from django.urls import path
from assessment.views import confidence_levels_views

urlpatterns = [
    path("", confidence_levels_views.ConfidenceLevelsApi.as_view()),
]