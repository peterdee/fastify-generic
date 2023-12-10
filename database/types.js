// This file contains database type definitions that can be reused

/** @typedef {import('mongodb').MongoClient} DatabaseClient */
/** @typedef {import('mongodb').Db} DatabaseInstance */

/**
 * @typedef {Object} User
 * @property {import('mongodb').ObjectId} _id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 */
