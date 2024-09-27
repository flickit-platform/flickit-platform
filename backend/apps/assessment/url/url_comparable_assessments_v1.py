from django.urls import path
from assessment.views import assessment_views
urlpatterns = [
    path("", assessment_views.AssessmentsComparableApi.as_view()),
]


