from django.urls import path, re_path
from rest_framework_nested import routers
from rest_framework_simplejwt import views
from rest_framework_simplejwt.views import TokenObtainPairView

from assessment.views import projectviews

from account.views import userviews, spaceviews
from account.views.userviews import UserActivationView
from account.views.spaceviews import ChangeCurrentSpaceViewSet
from account.serializers.authserializers import MyTokenObtainPairSerializer

router = routers.DefaultRouter()

router.register('users', userviews.CustomUserViewSet, basename='users')

urlpatterns = router.urls

urlpatterns += [
    path("spaces/adduser/<str:space_id>/", spaceviews.SpaceAccessAPI.as_view()),
    path("spaces/leave/<str:space_id>/", spaceviews.SpaceLeaveUserAPI.as_view()),
    path("users/spaces/invite/<str:space_id>/", userviews.InviteMemberForSpaceApi.as_view()),
    re_path(r"^jwt/create/?", TokenObtainPairView(serializer_class=MyTokenObtainPairSerializer).as_view(),
            name="jwt-create"),
    re_path(r"^jwt/refresh/?", views.TokenRefreshView.as_view(), name="jwt-refresh"),
    re_path(r"^jwt/verify/?", views.TokenVerifyView.as_view(), name="jwt-verify"),
    path('activate/<str:uid>/<str:token>/', UserActivationView.as_view()),
    path('changecurrentspace/<str:space_id>/', ChangeCurrentSpaceViewSet.as_view()),
]
