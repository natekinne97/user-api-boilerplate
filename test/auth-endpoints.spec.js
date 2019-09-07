const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
// helper pack
const helpers = require('./test-helpers')
// test all authentication endpoints. login
describe('Auth Endpoints', function () {
    let db
    // make basic fixtures
    const { testUsers } = helpers.makeArticlesFixtures()
    const testUser = testUsers[0]

    // connect to db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    // destroy connection
    after('disconnect from db', () => db.destroy())
    // remove data before tests
    before('cleanup', () => helpers.cleanTables(db))
    // remove data after tests
    afterEach('cleanup', () => helpers.cleanTables(db))
    // login route
    describe(`POST /api/auth/login`, () => {
        // seed db first
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )
        // fields needed for login
        const requiredFields = ['user_name', 'password']

        // check if fields are there
        requiredFields.forEach(field => {
            // login attempt
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password,
            }

            // test missing field response
            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })

        it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
            const userInvalidUser = { user_name: 'user-not', password: 'existy' }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUser)
                .expect(400, { error: `Incorrect user_name or password` })
        })

        it(`responds 400 'invalid user_name or password' when bad password`, () => {
            const userInvalidPass = { user_name: testUser.user_name, password: 'incorrect' }
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPass)
                .expect(400, { error: `Incorrect user_name or password` })
        })

        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
            
            const userValidCreds = {
                user_name: testUser.user_name,
                password: testUser.password,
            }
            // make a token
            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            )
            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken,
                })
        })
    })
})