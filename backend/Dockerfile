FROM python:3.11.9-slim-buster AS builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends gcc && \
    pip install --upgrade pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

FROM python:3.11.9-slim-buster

ENV HOME=/home/app \
    APP_HOME=/home/app/web

RUN apt-get update && apt-get install -y --no-install-recommends netcat && \
    addgroup --system app && adduser --system --ingroup app && \
    mkdir -p $APP_HOME/staticfiles $APP_HOME/mediafiles && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR $APP_HOME

COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/* && rm -rf /wheels

COPY ./scripts/run.sh ./run.sh
RUN chmod +x ./run.sh

COPY ./apps ./apps

RUN chown -R app:app $APP_HOME

USER app

EXPOSE 8000

ENTRYPOINT ["./run.sh"]