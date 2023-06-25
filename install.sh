#!/bin/bash
cd backend/scripts
sh settings_script.sh
cd ../..
# check install docker compose
if [ -x "$(command -v docker )" ] &&  docker help | grep -iq 'compose\*'; then
    docker compose up
elif [ -x "$(command -v docker-compose)" ]; then
    docker-compose up
else
    echo 'Error: docker-compose is not installed.' >&2
fi


