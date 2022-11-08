from celery import shared_task

from django.core.mail import BadHeaderError
from templated_mail.mail import BaseEmailMessage
from checkupassessmenttoolkit.settings import SITE_NAME, DOMAIN


@shared_task
def async_send(url, to, protocol):
    new_url = url.replace('activate','account/active')
    context ={'site_name': SITE_NAME, 'domain': DOMAIN, 'protocol': protocol, 'url': new_url}
    try:
        message = BaseEmailMessage(template_name='emails/activation.html', context = context)
        message.send([to])
    except BadHeaderError:
        pass

