# Frontend

Frontend code using the Angular framework

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Production Build
Run `pnpm prod` which is configured as alias for `ng build --configuration=production`. This will switch to using the `environment.prod.ts` variables, and place the built files in `dist/`.

## Docker Deployment
There are 2 ways of deploying a docker container for this project.

### Production
```
docker build -t local/taw-project:1.0 -f ./Dockerfile.prod .
docker run --name frontend_nginx --publish 4444:80 local/taw-project:1.0```

This will deploy a nginx server serving the build files under `dist/`.

### Development
```
docker build -t local/taw-project:1.0 -f ./Dockerfile .
docker run --name frontend_dev --publish 4444:4200 local/taw-project:1.0```

This will start a `node` server in development mode, running `ng serve`. Not suited for production.

