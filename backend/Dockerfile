FROM node:20-alpine as builder

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npx tsc


FROM node:20-alpine as runtime

WORKDIR /app

COPY ./package.json .

COPY --from=builder /app/dist .

RUN npm install --omit=dev

RUN npm install -g pino-pretty

ENV NODE_ENV production

EXPOSE 3000

CMD [ "sh", "-c", "node ./api.js | pino-pretty"]

