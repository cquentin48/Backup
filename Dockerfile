FROM node:16 AS builder

WORKDIR /app

COPY frontend/package.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build

FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 80

WORKDIR /var/log/nginx

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]