#!/bin/bash

sudo docker stop $2
sudo docker rm $2
sudo docker rmi $1

echo "Done removing."