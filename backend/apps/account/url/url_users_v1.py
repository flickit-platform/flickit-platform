from django.urls import path

from account.views import users_views

urlpatterns = [
    path("me/", users_views.UserInfoApi.as_view()),
]
