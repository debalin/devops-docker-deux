# Take base image from node repo
FROM node:argon

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
RUN npm install --silent

# Bundle app 
COPY . /code

# Expose the webapp
EXPOSE 8000

# This should run the webapp
CMD ["node", "webapp.js"]