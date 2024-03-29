# Frontend

Frontend code using the Angular framework. Configured to use the `pnpm` package manager, you can change this setting in `angular.json`

Install required packages with
```
pnpm install
```

## Development Server

Run `pnpm start` which is configured as alias for `ng serve --poll=2000`. This will start a dev server listening on `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Production Build
Run `pnpm prod` which is configured as alias for `ng build --configuration=production`. This will switch to using the `environment.prod.ts` variables, and place the built files in `dist/`.

## Docker Deployment
```
docker build -t local/taw-project-frontend:1.0 -f ./Dockerfile.prod .
docker run --name frontend_nginx --publish 14200:80 local/taw-project-frontend:1.0
```

This will deploy a `nginx` instance serving the built source files.

## Environment files
Templates of the env files have been provided, they should be filled out so that the program can utilize its variables.
Following files should be changed: `environment.ts.sample, environment.prod.ts.sample`.
