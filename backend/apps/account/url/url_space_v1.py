from django.urls import path

from account.views import space_views
urlpatterns = [
    path("", space_views.SpacesApi.as_view()),
    path("<str:space_id>/", space_views.SpaceApi.as_view()),
    path("<str:space_id>/members/", space_views.MembersSpaceApi.as_view()),
    path("<str:space_id>/members/<uuid:user_id>/", space_views.MemberSpaceApi.as_view()),
    path("<str:space_id>/invite/", space_views.InviteMemberInSpaceApi.as_view()),
    path("<str:space_id>/invitees/", space_views.InviteMembersSpaceApi.as_view()),
    path("<str:space_id>/seen/", space_views.SpaceSeenApi.as_view()),
    path("<str:space_id>/leave/", space_views.LeaveSpaceApi.as_view()),

]
