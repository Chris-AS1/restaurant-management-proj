# Backend

Backend API written in node+typescript. Using the `express` frameworks at its core. By default on port 3000.

Install required packages with
```
pnpm install
```

## Development Server

Run `pnpm start` which will build the files with `tsc` and then start the API server using `node`

## Docker Deployment
```
docker build -t local/taw-project-backend:1.0 -f ./Dockerfile .
docker run --name backend_node --publish 13000:3000 local/taw-project-backend:1.0
```

This will deploy a `node` instance, automatically compiling the source files.

## Environment files
Templates of the env files have been provided, they should be filled out so that the program can utilize its variables.
Following files should be changed: `.env.sample, /src/environment.ts.sample, /src/environment.prod.ts.sample, /src/environment.dev.ts.sample`

`/src/environment.ts.sample` should just be renamed, no changes are needed.

`environment.prod.ts` will be automatically used with Docker builds, or when `NODE_ENV=production`. Otherwise `environment.dev.ts` will be used instead

