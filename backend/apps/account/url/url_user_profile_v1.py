from django.urls import path

from account.views import users_views

urlpatterns = [
    path("", users_views.UserProfileApi.as_view()),
]
