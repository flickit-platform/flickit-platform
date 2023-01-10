from rest_framework_nested import routers
from django.urls import path
from .views import userviews
from .views import spaceviews
from assessment.views import projectviews


router = routers.DefaultRouter()
router.register('spaces', spaceviews.SpaceViewSet, basename='spaces')



user_access_router = routers.NestedDefaultRouter(router, 'spaces', lookup='space')
user_access_router.register('useraccess', userviews.UserAccessViewSet, basename='space-user-access')


assessments_router = routers.NestedDefaultRouter(router, 'spaces', lookup='space')
assessments_router.register('assessments', projectviews.AssessmentProjectBySpaceViewSet, basename='space-assessments')



urlpatterns = router.urls + user_access_router.urls + assessments_router.urls

urlpatterns += [
    path("spaces/adduser/<str:space_id>/", spaceviews.SpaceAccessAPI.as_view()),
]
