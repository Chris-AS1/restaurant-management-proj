# Restaurant-Management Project
Full stack application with the goal of handling booking/management of restaurant orders.
Backend was built on top of node/express. Frontend was built with Angular and then served with nginx.

## Docker Deployment
A `docker-compose.yml` file is provided. Before launching it the environment files have to be filled correctly and both `backend` and `frontend` have to be built.

By default the frontend port is bound to 14200 locally. For more informations check the respective READMEs.

```
docker compose build
docker compose up
```

## Default Users
By deafult there are 4 users: cashier, cook, bartender and waiter. All of them have "asd" as default password for demoing purposes.
