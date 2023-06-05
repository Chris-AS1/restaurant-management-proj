# Backend

Backend API written in node+typescript. Using the `express` frameworks at its core. By default on port 3000.

## Development Server

Run `pnpm start` which will build the files with `tsc` and then start the API server using `node`

## Docker Deployment
### Production
```
pnpm build
docker build -t local/taw-project-backend:1.0 -f ./Dockerfile.prod .
docker run --name backend_node --publish 3000:3000 local/taw-project-backend:1.0
```

This will deploy a `node` instance serving the build files under `dist/`.

## Environment files
Templates of the env files have been provided, they should be filled out so that the program can utilize its variables.
Following files should be changed: `.env.sample, /src/environment.ts.sample, /src/environment.prod.ts.sample, /src/environment.dev.ts.sample`

`/src/environment.ts.sample` should just be renamed, no changes are needed.
`environment.prod.ts` will be automatically used with Docker builds, or when `NODE_ENV=production`. Otherwise `environment.dev.ts` will be used instead

