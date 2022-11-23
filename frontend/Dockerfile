FROM node:18.9.0-alpine
WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install 
COPY . ./
EXPOSE 3000