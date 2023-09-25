from django.urls import path
from assessment.views import commonviews

urlpatterns = [
    path("", commonviews.ColorApi.as_view()),
]
