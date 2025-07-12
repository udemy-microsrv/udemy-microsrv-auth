FROM node:22-alpine3.21

env NATS_SERVERS="nats://localhost:4222"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
