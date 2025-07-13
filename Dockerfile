FROM node:22-alpine3.21

env NATS_SERVERS="nats://localhost:4222"
env DATABASE_URL="mongodb+srv://admin:1234@localhost:27017/auth_db"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
