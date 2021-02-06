const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const {makeGamesArray} = require('./games-fixtures')

describe('Games endpoints', function() {
    let db

    const testGames = makeGamesArray()

    before('make next instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before(() => db.raw('TRUNCATE games RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE games RESTART IDENTITY CASCADE'))
    
    after('disconnect from db', () => db.destroy())

    describe('GET /api/games', () => {
        context('Given there are games in the database', () => {
            beforeEach('insert games', () => {
                return db
                    .into('games')
                    .insert(testGames)
            })

            it('GET /api/games responds with 200 and all of the games', () => {
                return supertest(app)
                    .get('/api/games')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testGames.map(game => (
                        {...game, data_entered: game.data_entered.toISOString()}
                    )))
            })
        })

        context('Given there are not games in the db', () => {
            it ('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/games')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/games/:id', () => {
        context('Given there are games in the database', () => {
            beforeEach('insert games', () => {
                return db
                    .into('games')
                    .insert(testGames)
            })

            it('GET /api/games/:id responds with 200 and that user', () => {
                const id = "7UFLK3V2Tg"
                const expectedGame = testGames.find(game => game.id === id)
                return supertest(app)
                    .get(`/api/games/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, {...expectedGame, data_entered: expectedGame.data_entered.toISOString()})
            })
        })
    })

    describe('POST /api/games', () => {
        it('creates a new game entry, responding with 201 and that entry', function() {
            this.retries(3)

            const newGame = testGames[0]

            return supertest(app)
                .post('/api/games')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newGame)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newGame.id)
                    expect(res.body.name).to.eql(newGame.name)
                    expect(res.body.description).to.eql(newGame.description)
                    expect(res.body.min_players).to.eql(newGame.min_players)
                    expect(res.body.msrp).to.eql(newGame.msrp)
                    expect(res.body.max_players).to.eql(newGame.max_players)
                    expect(res.body.min_playtime).to.eql(newGame.min_playtime)
                    expect(res.body.max_playtime).to.eql(newGame.max_playtime)
                    expect(res.body.min_age).to.eql(newGame.min_age)
                    expect(res.body.small_image).to.eql(newGame.small_image)
                    expect(res.body.medium_image).to.eql(newGame.medium_image)
                    expect(res.body.original_image).to.eql(newGame.original_image)
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/games/${res.body.id}`)
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(res.body)
                )
        })
        it('responds with 400 and an error message when required fields are missing', () => {
            return supertest(app)
                .post('/api/games')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({})
                .expect(400, {
                    error: {message: 'An id and name are required'}
                })
        })
    })

    describe('DELETE /api/games/:id', () => {
        context('Given there are no games', () => {
            it ('responds with 404', () => {
                const id = "7UFLK3V2Tg"
                return supertest(app)
                    .delete(`/api/games/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: {message: `Game not in system`}})
            })
        })
        context('Given there are games in the db', () => {
            beforeEach('insert games', () => {
                return db
                    .into('games')
                    .insert(testGames)
            })

            it('responds with 204 and removes the game', () => {
                const idToRemove = "7UFLK3V2Tg"
                const expectedGames = testGames.filter(game => game.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/games/${idToRemove}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get('/api/games')
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(expectedGames.map(game => (
                                {...game, data_entered: game.data_entered.toISOString()}
                            )))
                    )
            })
        })
    })

    describe('PATCH /api/games/:id', () => {
        context('Given no games', () => {
            it('responds with 404', () => {
                const id = "7UFLK3V2Tg"
                return supertest(app)
                    .patch(`/api/games/${id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, { error: {message: `Game not in system`}})
            })
        })

        context('Given there are games in the database', () => {
            beforeEach('insert games', () => {
                return db
                    .into('games')
                    .insert(testGames)
            })

            it('responds with 204 and updates the game', () => {
                const idToUpdate = "7UFLK3V2Tg"
                const updatedGame = {
                    name: "Updated name"
                }
                const oldGameData = testGames.find(game => game.id === idToUpdate)
                const expectedGame = {
                    ...oldGameData,
                    ...updatedGame
                }
                return supertest(app)
                    .patch(`/api/games/${idToUpdate}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(updatedGame)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/games/${idToUpdate}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect({...expectedGame, data_entered: expectedGame.data_entered.toISOString()})
                    )
            })

            it('responds with 400 when no required fields are supplied', () => {
                const idToUpdate = "7UFLK3V2Tg"

                return supertest(app)
                    .patch(`/api/games/${idToUpdate}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain one of the following fields: id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, or original_image`
                        }
                    })
            })
        })
    })
})