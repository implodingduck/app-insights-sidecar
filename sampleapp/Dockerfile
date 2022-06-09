FROM node:18-alpine3.15

RUN apk add --update curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
ENTRYPOINT [ "node", "index.js"]