FROM python:3.10-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY . ./

WORKDIR /apps
EXPOSE 8000

USER root
RUN echo -e "http://nl.alpinelinux.org/alpine/v3.13/main\nhttp://nl.alpinelinux.org/alpine/v3.13/community" > /etc/apk/repositories
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.13/main" > /etc/apk/repositories
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add mailcap && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-deps \
        build-base postgresql-dev musl-dev linux-headers && \
    /py/bin/pip install -r /requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home assessmentplatform && \
    mkdir -p /vol/web/static && \
    mkdir -p /vol/web/media && \
    chown -R assessmentplatform:assessmentplatform /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts

ENV PATH="/scripts:/py/bin:$PATH"

USER assessmentplatform

CMD ["run.sh"]
