FROM node:20-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

# RUN ng build --configuration=production
CMD [ "npm", "start" ]

