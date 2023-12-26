FROM node:latest

RUN apt-get update && apt-get install -y nginx
RUN rm /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY . .


CMD ["nginx", "-g", "daemon off;"]