# Frontend build operations
FROM node:18.0 AS builder

# Copy the frontend web app folder and its content ; then install the packages
WORKDIR /app
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./

# Build the output into static pages
RUN npm run build

# Nginx reverse proxy
FROM nginx:latest

# Replacing the nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Adding the output static for reverse proxy and the application for continuous integration
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app /home/

# Installing npm
RUN apt update -y
RUN apt install npm -y

# Setting the container to be in Continuous Integration mode (notifying Jest to stop at the end of the tests)
ENV CI=true

# Port exposed
EXPOSE 80

# Moving to the project root folder
WORKDIR /home