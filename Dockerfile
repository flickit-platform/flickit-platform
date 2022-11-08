FROM python:3.10-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
COPY ./checkupassessmenttoolkit /checkupassessmenttoolkit
COPY ./scripts /scripts

WORKDIR /checkupassessmenttoolkit
EXPOSE 8000

USER root
RUN echo -e "http://nl.alpinelinux.org/alpine/v3.13/main\nhttp://nl.alpinelinux.org/alpine/v3.13/community" > /etc/apk/repositories
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.13/main" > /etc/apk/repositories
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-deps \
        build-base postgresql-dev musl-dev linux-headers && \
    /py/bin/pip install -r /requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home checkupassessmenttoolkit && \
    mkdir -p /admin/vol/web/static && \
    mkdir -p /admin/vol/web/media && \
    chown -R checkupassessmenttoolkit:checkupassessmenttoolkit /admin && \
    chmod -R 755 /admin && \
    chmod -R +x /scripts

ENV PATH="/scripts:/py/bin:$PATH"

USER checkupassessmenttoolkit

CMD ["run.sh"]