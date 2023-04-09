from celery import shared_task
from django.core.mail import BadHeaderError
from templated_mail.mail import BaseEmailMessage

from assessmentplatform.settings import SITE_NAME, DOMAIN, EXPIRATION_DAYS

@shared_task
def async_send_invite_for_expert_group(url,inviter_name, group_name, to):
    context ={'expert_group_name': SITE_NAME, 'domain': DOMAIN, 'protocol': 'https',
               'url': url, 'expiration_days': EXPIRATION_DAYS, 'inviter_name': inviter_name, 'group_name': group_name}
    try:
        message = BaseEmailMessage(template_name='emails/expert_invite.html', context = context)
        message.send([to])
    except BadHeaderError:
        pass

