from django.urls import path
from assessment.views import assessments_compare_views
urlpatterns = [
    path("", assessments_compare_views.AssessmentsCompareApi.as_view()),
]


