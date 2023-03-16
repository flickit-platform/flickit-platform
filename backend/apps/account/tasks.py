from celery import shared_task
from templated_mail.mail import BaseEmailMessage
from django.core.mail import BadHeaderError

from assessmentplatform.settings import SITE_NAME, DOMAIN, EXPIRATION_DAYS


@shared_task
def async_send(url, to, protocol, display_name):
    new_url = url.replace('activate','account/active')
    context ={'site_name': SITE_NAME, 'domain': DOMAIN, 'protocol': protocol,
               'url': new_url, 'display_name': display_name, 'expiration_days': EXPIRATION_DAYS}
    try:
        message = BaseEmailMessage(template_name='emails/activation.html', context = context)
        message.send([to])
    except BadHeaderError:
        pass


@shared_task
def async_send_invite(url, to, protocol, inviter_name):
    context ={'site_name': SITE_NAME, 'domain': DOMAIN, 'protocol': protocol,
               'url': url, 'expiration_days': EXPIRATION_DAYS, 'inviter_name': inviter_name}
    try:
        message = BaseEmailMessage(template_name='emails/invite.html', context = context)
        message.send([to])
    except BadHeaderError:
        pass

