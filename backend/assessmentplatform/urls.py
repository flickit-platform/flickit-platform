from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from django.views.i18n import set_language
from mezzanine.conf import settings
from account.views import UserActivationView
from account.views import ChangeCurrentSpaceViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .settings import __version__

admin.autodiscover()


schema_view = get_schema_view(
   openapi.Info(
      title="Assessment-Platform API",
      default_version= __version__,
      description="Test description",
   ),
   public=True,
   permission_classes=[permissions.IsAdminUser],
)

urlpatterns = i18n_patterns(
    path("admin/", include(admin.site.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema'),
    path('auth/', include('djoser.urls')),
    path('activate/<str:uid>/<str:token>/', UserActivationView.as_view()),
    path('changecurrentspace/<str:space_id>/', ChangeCurrentSpaceViewSet.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('baseinfo/', include('baseinfo.urls')),
    path('assessment/', include('assessment.urls')),
    path('authinfo/', include('account.urls')),
)

if settings.USE_MODELTRANSLATION:
    urlpatterns += [
        path("i18n", set_language, name="set_language"),
    ]




urlpatterns += [
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    path("", include("mezzanine.urls")),
]

handler404 = "mezzanine.core.views.page_not_found"
handler500 = "mezzanine.core.views.server_error"
