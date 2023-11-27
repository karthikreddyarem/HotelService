FROM node:16.17.0-bullseye-slim

# FROM ubuntu:18.04
# RUN apt-get update
# RUN apt-get -y install curl

# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
# RUN apt-get install -y nodejs

WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install 
EXPOSE 7070
CMD node app.js 