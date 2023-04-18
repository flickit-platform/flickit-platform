# FROM node:18.9.0-alpine
# WORKDIR /app/frontend

# COPY package.json package-lock.json ./
# RUN npm install 
# COPY . ./
# EXPOSE 3000


# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /frontend

# Copy the current directory contents into the container at /app
COPY . /frontend

# Install any needed packages specified in package.json
RUN npm install

# Build the React app
RUN npm run build

# Serve the React app using Nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
