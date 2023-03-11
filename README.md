# Opentelemetry tutorial

Following [opentelemetry turorial](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/) in typescript

Added small improvements like:

- use nodemon to hot reload
- use a .http file to call relevant apis

## Jaeger support

You can collect the data in Jaeger and explore its [UI](http://localhost:16686/).

To start the Jaeger server:
`docker-compose up -d`
To stop it:
`docker-compose down`
to see its logs:
`docker-compose logs -f jaeger`

Or use the equivalent npm scripts
