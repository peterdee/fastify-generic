// This file contains global type definitions that can be reused

/** @typedef {import('fastify').FastifyInstance} FastifyInstance */
/** @typedef {import('fastify').FastifyReply} FastifyReply */
/** @typedef {import('fastify').FastifyRequest} FastifyRequest */
/** @typedef {import('redis').RedisClientType} RedisClient */
/** @typedef {import('joi').ValidationError} ValidationError */

/**
 * @typedef {Object} Pagination
 * @property {number} limit
 * @property {number} offset
 * @property {number} page
 */
