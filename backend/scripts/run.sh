#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput

uwsgi --http :8000 --workers 4 --master --enable-threads --module assessmentplatform.wsgi \
 --buffer-size 32768 \
 --static-map /static=/home/apps/static \
 --static-map /media=/home/apps/media
