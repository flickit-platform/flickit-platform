from django.urls import path

from account.views import users_views

urlpatterns = [
    path("me/", users_views.UserInfoApi.as_view()),
    path("email/<str:email>/", users_views.LoadUserByEmailApi.as_view()),
]
