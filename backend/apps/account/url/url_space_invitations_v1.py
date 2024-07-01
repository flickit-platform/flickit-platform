from django.urls import path

from account.views import space_views

urlpatterns = [
    path("<uuid:invite_id>/", space_views.RemoveSpaceInviteApi.as_view()),
]
