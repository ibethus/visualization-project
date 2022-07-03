# étape de build
FROM node:lts-alpine as build-stage
RUN apk update
RUN apk add git
WORKDIR /app
## Récupération de la lib custom
RUN git clone https://github.com/Sajinnn/vue-network-d3.git
WORKDIR /app/vue-network-d3
RUN npm install
RUN npm run build
## Build du projet et copie
WORKDIR /app/install
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# étape de production
FROM nginx:stable-alpine as production-stage
##Copie des sources
COPY --from=build-stage /app/install/dist /usr/share/nginx/html
## Configuration du serveur nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]