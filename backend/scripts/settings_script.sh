sed -i "s|^\(EMAIL_HOST =\).*|\1 'mail.asta.ir'|" ./apps/assessmentplatform/settings.py
sed -i "s|^\(EMAIL_HOST_USER =\).*|\1 'sajjafari@asta.ir'|" ./apps/assessmentplatform/settings.py
sed -i "s/EMAIL_HOST_PASSWORD =.*/EMAIL_HOST_PASSWORD = 'changeit'/" ./apps/assessmentplatform/settings.py
sed -i "s|^\(DEFAULT_FROM_EMAIL =\).*|\1 'sajjafari@asta.ir'|" ./apps/assessmentplatform/settings.py
