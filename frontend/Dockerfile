FROM node:16.16.0 as build

# Set the working directory in the container
WORKDIR /app

COPY package*.json .
RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html