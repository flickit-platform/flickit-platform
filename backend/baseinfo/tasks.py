from celery import shared_task

from django.core.mail import BadHeaderError
from templated_mail.mail import BaseEmailMessage
from assessmentplatform.settings import SITE_NAME, DOMAIN


@shared_task
def async_send_invite_for_expert_group(url, to):
    context ={'expert_group_name': SITE_NAME, 'domain': DOMAIN, 'protocol': 'https', 'url': url}
    try:
        message = BaseEmailMessage(template_name='emails/invite.html', context = context)
        message.send([to])
    except BadHeaderError:
        pass

