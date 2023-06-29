from django.contrib import admin
from django.urls import include, path ,re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static

from baseinfo.models.assessmentkitmodels import AssessmentKitDsl
from assessmentplatform import settings
from baseinfo.views import importassessmentkitviews

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

dsl_path = f"{settings.MEDIA_URL} { AssessmentKitDsl._meta.get_field('dsl_file').upload_to }"
dsl_path = dsl_path.replace(' ','')
dsl_path = dsl_path[1:]

urlpatterns = [
   path("admin/", admin.site.urls),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema'),
   path('authinfo/', include('djoser.urls')),
   path('baseinfo/', include('baseinfo.urls')),
   path('assessment/', include('assessment.urls')),
   path('authinfo/', include('account.urls')),
   path('api/internal/',include('baseinfo.urls_internal')),
   re_path(dsl_path+"/.*?",importassessmentkitviews.access_dsl_file),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

