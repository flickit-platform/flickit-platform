from django.urls import path, re_path
from rest_framework_nested import routers
from rest_framework_simplejwt import views
from rest_framework_simplejwt.views import TokenObtainPairView

from assessment.views import projectviews

from account.views.spaceviews import ChangeCurrentSpaceViewSet
from account.serializers.authserializers import MyTokenObtainPairSerializer

router = routers.DefaultRouter()


urlpatterns = router.urls

urlpatterns += [
    re_path(r"^jwt/create/?", TokenObtainPairView(serializer_class=MyTokenObtainPairSerializer).as_view(),
            name="jwt-create"),
    re_path(r"^jwt/refresh/?", views.TokenRefreshView.as_view(), name="jwt-refresh"),
    re_path(r"^jwt/verify/?", views.TokenVerifyView.as_view(), name="jwt-verify"),
    path('changecurrentspace/<str:space_id>/', ChangeCurrentSpaceViewSet.as_view()),
]
