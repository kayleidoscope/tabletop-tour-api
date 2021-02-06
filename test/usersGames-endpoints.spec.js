const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const {makeUsersGamesArray} = require('./usersGames-fixtures')
const {makeGamesArray} = require('./games-fixtures')
const {makeUsersArray} = require('./users-fixtures');

describe('/users-games endpoints', function () {
    let db;

    let testUsersGames = makeUsersGamesArray()
    let testGames = makeGamesArray()
    let testUsers = makeUsersArray()


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before(() => db.raw('TRUNCATE users, games, users_games RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE users, games, users_games RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    describe('GET /api/users-games', () => {
        context('Given there are items in the database', () => {
            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('games')
                            .insert(testGames)
                    })
                    .then(() => {
                        return db
                            .into('users_games')
                            .insert(testUsersGames)
                    })
            })
    
            it('GET /api/users-games responds with 200 and all of the games', () => {
                return supertest(app)
                    .get('/api/users-games')
                    .expect(200, testUsersGames)
            })
    
            it('GET /api/users-games?user_id=[?] responds with 200 and that users logged games', () => {
                const userId = 1
                const expectedGames = testUsersGames.filter(usersGame => usersGame.user_id === userId)
    
                return supertest(app)
                    .get(`/api/users-games?user_id=${userId}`)
                    .expect(200, expectedGames)
            })
        })

        context('Given there are no items in the database', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/games')
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/users-games/[user_id]/[game_id]', () => {
        context('Given there are items in the table', () => {
            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('games')
                            .insert(testGames)
                    })
                    .then(() => {
                        return db
                            .into('users_games')
                            .insert(testUsersGames)
                    })
            })

            it('GET /api/users-grams/[user_id]/[game_id]', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"

                const expectedItem = testUsersGames.find(usersGame => usersGame.user_id === userId && usersGame.game_id ===gameId)
                return supertest(app)
                    .get(`/api/users-games/${userId}/${gameId}`)
                    .expect(200, expectedItem)
            })
        })

        context('Given there are no items in the table', () => {
            it('GET /api/users-games/[user_id]/[game_id] responds with an error messsage', () => {
                const userId = 10
                const gameId = "7UXXK3V2Tg"
    
                return supertest(app)
                    .get(`/api/users-games/${userId}/${gameId}`)
                    .expect(404, {
                        error: {message: `Users-game item not in system`}
                    })
            })
        })
    })

    describe('POST /api/users-games', () => {
        beforeEach(() => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('games')
                        .insert(testGames)
                })
        })

        it('creates a new entry, responding with 201 and that entry', function () {
            const newEntry = testUsersGames[0]

            return supertest(app)
                .post('/api/users-games')
                .send(newEntry)
                .expect(201)
                .expect(res => {
                    expect(res.body.user_id).to.eql(newEntry.user_id)
                    expect(res.body.game_id).to.eql(newEntry.game_id)
                    expect(res.body.user_played).to.eql(newEntry.user_played)
                    expect(res.body.user_loved).to.eql(newEntry.user_loved)
                    expect(res.body.user_saved).to.eql(newEntry.user_saved)
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/users-games/${res.body.user_id}/${res.body.game_id}`)
                        .expect(res.body)
                )
        })

        it('responds with 400 and an error message when required fields are missing', () => {
            return supertest(app)
                .post('/api/users-games')
                .send({})
                .expect(400, {
                    error: {message: 'User_id and game_id are required'}
                })
        })
    })

    describe('DELETE /api/users-games/:user_id/:game_id', () => {
        context('Given no items in the table', () => {
            it('responds with 404', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"
                return supertest(app)
                    .delete(`/api/users-games/${userId}/${gameId}`)
                    .expect(404, {
                        error: {message: `Users-game item not in system`}
                    })
            })
        })

        context('Given there are items in the db', () => {
            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('games')
                            .insert(testGames)
                    })
                    .then(() => {
                        return db
                            .into('users_games')
                            .insert(testUsersGames)
                    })
            })

            it('responds with 204 and removes the game', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"

                return supertest(app)
                    .delete(`/api/users-games/${userId}/${gameId}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/users-games/${userId}/${gameId}`)
                            .expect(404, {
                                error: {message: `Users-game item not in system`}
                            })
                    )
            })
        })
    })

    describe('PATCH /api/users-games/:user_id/:game_id', () => {
        context('Given no items in table', () => {
            it('responds with 404', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"
                return supertest(app)
                    .delete(`/api/users-games/${userId}/${gameId}`)
                    .expect(404, {
                        error: {message: `Users-game item not in system`}
                    })
            })
        })

        context('Given there are items in the table', () => {
            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('games')
                            .insert(testGames)
                    })
                    .then(() => {
                        return db
                            .into('users_games')
                            .insert(testUsersGames)
                    })
            })

            it('responds with 204 and updates the item', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"
                const updatedField = {
                    user_played: true
                }

                const oldData = testUsersGames.find(usersGame => usersGame.user_id === userId && usersGame.game_id === gameId)
                const expectedObject = {
                    ...oldData,
                    ...updatedField
                }

                return supertest(app)
                    .patch(`/api/users-games/${userId}/${gameId}`)
                    .send(updatedField)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/users-games/${userId}/${gameId}`)
                            .expect(expectedObject)
                    )
            })

            it('responds with 400 when no required fields are supplied', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"

                return supertest(app)
                    .patch(`/api/users-games/${userId}/${gameId}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain one of the following fields: user_id, game_id, user_played, user_loved, user_saved`
                        }
                    })
            })
        })
    })
})