from django.urls import path

from account.views import notify_settings_views

urlpatterns = [
    path("", notify_settings_views.NotificationSettingsApi.as_view(), name="notify_settings_v1"),
    ]