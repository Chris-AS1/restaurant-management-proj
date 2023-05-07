# Backend

Backend API written in node+typescript. Using the `express` frameworks at its core. By default on port 3000.

## Development Server

Run `pnpm start` which will put `tsc` in watch mode and execute the compiled javascript once done.

## Production Build
Run `pnpm prod` which will build and run the compiled code, this time without any monitoring for changes.

## Docker Deployment
### Production
```
pnpm build
docker build -t local/taw-project-backend:1.0 -f ./Dockerfile.prod .
docker run --name backend_node --publish 3000:3000 local/taw-project-backend:1.0
```

This will deploy a `node` instance serving the build files under `dist/`.


