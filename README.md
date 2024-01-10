## fastify-generic

Generic Fastify project with API documentation, API testing, authorization, database connection, Redis caching, etc.

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

### Testing

Tests are done with [`node:assert`](https://nodejs.org/api/assert.html) and [`node:test`](https://nodejs.org/api/test.html)

Run all tests:

```shell script
npm run test
```

It is possible to run a specific test (for example just a single controller test):

```shell script
export APP_ENV=testing && node --test ./apis/me/controller.test.js
```

### License

[MIT](./LICENSE.md)
