## fastify-generic

Basic Fastify server

### API documentation

API documentation is generated using [apiDoc](https://www.npmjs.com/package/apidoc)

In order to generate documentation, `apiDoc` should be installed globally:

```shell script
npm i -g apidoc
```

Generate documentation:

```shell script
npm run docs
```

Documentation will be available at [http://localhost:9999/docs/](http://localhost:9999/docs/) once you start the server, however it will not be served if `APP_ENV` environment variable is set to `production`

### License

[MIT](./LICENSE.md)
