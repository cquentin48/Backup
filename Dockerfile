FROM node:18.0 AS builder

WORKDIR /app

COPY frontend/package.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build

FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app /home/

WORKDIR /usr/share/nginx/html

RUN apt update -y
RUN apt install npm -y

ENV CI=true

EXPOSE 80

WORKDIR /var/log/nginx

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]