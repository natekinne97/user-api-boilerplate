const bcrypt = require('bcryptjs')

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            full_name: 'Test user 1',
            nickname: 'TU1',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            user_name: 'test-user-2',
            full_name: 'Test user 2',
            nickname: 'TU2',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 3,
            user_name: 'test-user-3',
            full_name: 'Test user 3',
            nickname: 'TU3',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 4,
            user_name: 'test-user-4',
            full_name: 'Test user 4',
            nickname: 'TU4',
            password: 'password',
            date_created: new Date('2029-01-22T16:28:32.615Z'),
        },
    ]
}


function makeArticlesFixtures() {
    const testUsers = makeUsersArray()
    const testArticles = makeArticlesArray(testUsers)
    const testComments = makeCommentsArray(testUsers, testArticles)
    return { testUsers, testArticles, testComments }
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
        blogful_articles,
        blogful_users,
        blogful_comments
      `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE blogful_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
                    trx.raw(`SELECT setval('blogful_users_id_seq', 0)`),
                    trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('blogful_users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('blogful_users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}



function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
   
    makeArticlesFixtures,
    cleanTables,
   
    makeAuthHeader,
    seedUsers,
}

