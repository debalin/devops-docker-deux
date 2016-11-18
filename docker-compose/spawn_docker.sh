#!/bin/bash

sudo docker stop $3
sudo docker rm $3
sudo docker rmi $1
sudo docker build -t $1 webapp/ --build-arg port=$2
sudo docker run -p $2:$2 -d --name $3 $1

echo "Done spawning."