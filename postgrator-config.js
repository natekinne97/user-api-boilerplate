process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '3m'

require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "host": process.env.MIGRATION_DB_HOST,
    "port": process.env.MIGRATION_DB_PORT,
    "database": process.env.MIGRATION_DB_NAME,
    "username": process.env.MIGRATION_DB_USER,
    "password": process.env.MIGRATION_DB_PASS
}
