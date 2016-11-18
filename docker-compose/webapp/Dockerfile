# Take base image from node repo
FROM node:argon

ARG port=3000
ENV start_port $port

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
RUN npm install --silent

# Bundle app 
COPY . /code

# Expose the webapp
EXPOSE $port

# This should run the webapp
CMD ["node", "main.js"]