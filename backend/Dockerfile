FROM python:3.11.9-slim-bookworm AS builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential

RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

FROM python:3.11.9-slim-bookworm

RUN addgroup --system app && adduser --system --group app
ENV HOME=/home \
    APP_HOME=/home/apps

RUN mkdir -p $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    mailcap

COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/* && rm -rf /wheels

COPY apps $APP_HOME
COPY scripts/run.sh $APP_HOME/run.sh

RUN chown -R app:app $APP_HOME

RUN chmod +x $APP_HOME/run.sh

USER app

ENTRYPOINT ["./run.sh"]
