# Take base image from node repo
FROM node:argon

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
RUN npm install --silent
RUN apt-get update
RUN apt-get --assume-yes install socat

# Bundle app 
COPY . /code

# Expose the webapp
EXPOSE 7000

# This should run the webapp
CMD ["node", "write.js"]