"""
WSGI config for checkupassessmenttoolkit project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from mezzanine.utils.conf import real_project_name

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE", "%s.settings" % real_project_name("checkupassessmenttoolkit")
)

application = get_wsgi_application()
