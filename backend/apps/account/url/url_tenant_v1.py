from django.urls import path

from account.views.tenant_views import TenantInfoApi

urlpatterns = [
    path("info/", TenantInfoApi.as_view()),
]
