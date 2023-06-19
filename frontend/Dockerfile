FROM node:20-alpine AS builder

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npx ng build --configuration=production


FROM nginx:1.24-alpine AS runtime

EXPOSE 80

COPY .nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
