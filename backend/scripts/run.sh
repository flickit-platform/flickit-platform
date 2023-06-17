#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py migrate

uwsgi --http :8000 --workers 4 --master --enable-threads --module assessmentplatform.wsgi \
 --buffer-size 32768 \
 --static-map /static=/vol/web/static \
 --static-map /media=/vol/web/media

 celery -A assessmentplatform worker -l info