FROM node:18.9.0-alpine as build-stage
WORKDIR /app/frontend

COPY package*.json ./
RUN npm install 
COPY ./ /app/frontend/
RUN npm run build
