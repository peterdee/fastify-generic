// This file contains database type definitions that can be reused

/** @typedef {import('mongodb').MongoClient} DatabaseClient */
/** @typedef {import('mongodb').Db} DatabaseInstance */
/** @typedef {import('mongodb').InsertOneResult} InsertionResult */
/** @typedef {import('mongodb').ObjectId} ObjectId */

/**
 * @typedef {object} BaseProperties
 * @property {ObjectId} _id
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * @typedef {object} PasswordProperties
 * @property {string} passwordHash
 * @property {string} userId
 * @typedef {BaseProperties & PasswordProperties} Password
 */

/**
 * @typedef {object} RefreshTokenProperties
 * @property {number} expiresAt
 * @property {string} tokenString
 * @property {string} userId
 * @typedef {BaseProperties & RefreshTokenProperties} RefreshToken
 */

/**
 * @typedef {object} UserProperties
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @typedef {BaseProperties & UserProperties} User
 */

/**
 * @typedef {object} UserSecretProperties
 * @property {string} secretString
 * @property {string} userId
 * @typedef {BaseProperties & UserSecretProperties} UserSecret
 */
