#!/bin/bash

echo "Stopping any previous docker containers."
sudo docker ps -a | grep 'webapp_' | awk '{print $1}' | xargs --no-run-if-empty sudo docker stop
sudo docker ps -a | grep 'webapp_' | awk '{print $1}' | xargs --no-run-if-empty sudo docker rm
sudo docker-compose stop

echo "Building initial docker compose."
sudo docker-compose build > /dev/null

echo "Intalling dependencies for infrastructure."
npm install

echo "Running docker compose."
sudo docker-compose up > /dev/null &

echo "Running infrastructure."
sleep 30
forever stop infrastructure.js
forever start infrastructure.js