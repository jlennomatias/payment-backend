FROM node:20.11.1-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npx prisma generate

ARG PORT
ENV PORT $PORT
EXPOSE $PORT


CMD ["npm", "run", "start"]
