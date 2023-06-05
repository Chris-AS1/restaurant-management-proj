# Frontend

Frontend code using the Angular framework. Configured to use the `pnpm` package manager, you can change this setting in `angular.json`

## Development Server

Run `pnpm start` which is configured as alias for `ng serve --poll=2000`. This will start a dev server listening on `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Production Build
Run `pnpm prod` which is configured as alias for `ng build --configuration=production`. This will switch to using the `environment.prod.ts` variables, and place the built files in `dist/`.

## Docker Deployment
There are 2 ways of deploying a docker container for this project.

### Production (nginx)
```
pnpm prod
docker build -t local/taw-project-frontend:1.0 -f ./Dockerfile.prod .
docker run --name frontend_nginx --publish 4444:80 local/taw-project-frontend:1.0
```

This will deploy a `nginx` instance serving the built files under `dist/`.

### Development (node/ng)
```
docker build -t local/taw-project-frontend:1.0 -f ./Dockerfile.dev .
docker run --name frontend_dev --publish 4444:4200 local/taw-project-frontend:1.0
```

This will start a `node` server in development mode, running `ng serve`. Not suited for production.

