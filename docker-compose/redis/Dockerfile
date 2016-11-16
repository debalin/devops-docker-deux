# Take base image from node repo
FROM ubuntu:14.04

# Install redis-server
RUN apt-get update && apt-get install -y redis-server

# Expose port 6379
EXPOSE 6379

# Start redis server
ENTRYPOINT  ["/usr/bin/redis-server"]