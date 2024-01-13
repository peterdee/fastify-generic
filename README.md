## fastify-generic

Generic Fastify project with API documentation, API testing, authorization, database connection, Redis caching, etc.

Some of the code is typed with [JSDoc](https://jsdoc.app), but types are not enforced (not using `@ts-check` directive)

### Deploy locally

```shell script
git clone https://github.com/peterdee/fastify-generic
cd ./fastify-generic
nvm use 20
npm ci
```

### Environment variables

The `.env` file is required, see [.env.example](.env.example) for details

### Launching the server

Launch in `development` with hot reloading:

```shell script
npm run dev
```

Launch in `production`:

```shell script
npm start
```

Server will be available at http://localhost:9999

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

Tests are using [`mongodb-memory-server`](https://www.npmjs.com/package/mongodb-memory-server) to emulate MongoDB connection, but there are no emulation for Redis (currently no modules are available for that): when tests are running, the app will try to connect to the Redis server specified by the `REDIS_TEST_CONNECTION_STRING` environment variable

Run all tests:

```shell script
npm run test
```

It is possible to run a specific test (for example just a single controller test):

```shell script
export APP_ENV=testing && node --test ./apis/me/controller.test.js
```

### Linting

Using [ESLint](https://eslint.org)

### License

[MIT](./LICENSE.md)
