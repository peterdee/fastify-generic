// This file contains global type definitions that can be reused

/** @typedef {import('fastify').FastifyInstance} FastifyInstance */
/** @typedef {import('fastify').FastifyReply} FastifyReply */
/** @typedef {import('fastify').FastifyRequest} FastifyRequest */
/** @typedef {import('redis').RedisClientType} RedisClient */
/** @typedef {import('joi').ValidationError} ValidationError */

/**
 * @typedef {object} MongoOptions
 * @property {object} connectionOptions
 * @property {string} connectionString
 * @property {string} databaseName
 */

/**
 * @typedef {object} RedisOptions
 * @property {string} connectionString
 * @property {boolean} flushOnStartup
 */

/**
 * @typedef {object} CreateServerOptions
 * @property {string} APP_ENV
 * @property {MongoOptions} mongoOptions
 * @property {number} port
 * @property {RedisOptions} redisOptions
 */

/**
 * @typedef {Object} Pagination
 * @property {number} limit
 * @property {number} offset
 * @property {number} page
 */

/**
 * @typedef {object} TestingResources
 * @property {string?} accessToken
 * @property {object | null} customData
 * @property {FastifyInstance | null} fastifyServer
 * @property {import('mongodb-memory-server').MongoMemoryServer | null} mongoServer
 * @property {string?} refreshToken
 * @property {User | null} user
 */
