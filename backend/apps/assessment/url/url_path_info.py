from django.urls import path
from assessment.views import commonviews
urlpatterns = [
    path("", commonviews.PathInfoApi.as_view()),
]
