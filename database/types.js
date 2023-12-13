// This file contains database type definitions that can be reused

/** @typedef {import('mongodb').MongoClient} DatabaseClient */
/** @typedef {import('mongodb').Db} DatabaseInstance */
/** @typedef {import('mongodb').InsertOneResult} InsertionResult */
/** @typedef {import('mongodb').ObjectId} ObjectId */

/**
 * @typedef {Object} Password
 * @property {ObjectId} _id
 * @property {string} passwordHash
 * @property {string} userId
 */

/**
 * @typedef {Object} RefreshToken
 * @property {ObjectId} _id
 * @property {number} expiresAt
 * @property {string} tokenString
 * @property {string} userId
 */

/**
 * @typedef {Object} User
 * @property {ObjectId} _id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * @typedef {Object} UserSecret
 * @property {ObjectId} _id
 * @property {string} secretString
 * @property {string} userId
 */
