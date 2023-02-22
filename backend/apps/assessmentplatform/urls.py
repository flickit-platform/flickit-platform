from django.contrib import admin
from django.urls import include, path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static

from assessmentplatform import settings

admin.autodiscover()

schema_view = get_schema_view(
   openapi.Info(
      title="Assessment-Platform API",
      default_version= settings.__version__,
      description="Test description",
   ),
   public=True,
   permission_classes=[permissions.IsAdminUser],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema'),
   #  path('auth/', include('djoser.urls')),
    path('baseinfo/', include('baseinfo.urls')),
    path('assessment/', include('assessment.urls')),
    path('authinfo/', include('account.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

