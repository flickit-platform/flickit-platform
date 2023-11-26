from django.urls import path
from baseinfo.views import confidence_levels_views

urlpatterns = [
    path("", confidence_levels_views.ConfidenceLevelsApi.as_view()),
]