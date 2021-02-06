const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const {makeReviewsArray} = require('./reviews-fixtures')
const {makeGamesArray} = require('./games-fixtures')
const {makeUsersArray} = require('./users-fixtures');

describe('/reviews endpoints', function() {
    let db;

    let testReviews = makeReviewsArray()
    let testGames = makeGamesArray()
    let testUsers = makeUsersArray()


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before(() => db.raw('TRUNCATE users, games, reviews RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE users, games, reviews RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    describe('GET /api/reviews', () => {
        context('Given there are reviews in the table', () => {
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
                            .into('reviews')
                            .insert(testReviews)
                    })
            })

            it('GET /api/reviews responds with 200 and all of the reviews', () => {
                return supertest(app)
                    .get('/api/reviews')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testReviews.map(review => (
                        {...review, review_posted: review.review_posted.toISOString()}
                    )))
            })

            it('GET /api/review?user_id=[?] responds with 200 and reviews by that user', () => {
                const userId = 1
                const expectedReviews = testReviews.filter(review => review.user_id === userId)

                return supertest(app)
                    .get(`/api/reviews?user_id=${userId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedReviews.map(review => (
                        {...review, review_posted: review.review_posted.toISOString()}
                    )))
            })

            it('GET /api/reviews?game_id=[?] responds 200 and with reviews of a game', () => {
                const gameId = "7UFLK3V2Tg"
                const expectedReviews = testReviews.filter(review => review.game_id === gameId)

                return supertest(app)
                    .get(`/api/reviews?game_id=${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedReviews.map(review => (
                        {...review, review_posted: review.review_posted.toISOString()}
                    )))
            })
        })

        context('Given there are no reviews in the table', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/reviews')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/reviews/[user_id]/[game_id]', () => {
        context('Given there are reviews in the table', () => {
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
                            .into('reviews')
                            .insert(testReviews)
                    })
            })

            it('GET /api/reviews/[user_id]/[game_id]', () => {
                const userId = 2
                const gameId = "7UFLK3V2Tg"

                const expectedReview = testReviews.find(review => review.user_id === userId && review.game_id === gameId)
                
                return supertest(app)
                    .get(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, {
                        ...expectedReview, review_posted: expectedReview.review_posted.toISOString()
                    })
            })
        })

        context('Given no reviews in the table', () => {
            it('GET /api/reviews/[user_id]/[game_id] responds with an error', () => {
                const userId = 10
                const gameId = "7UXXK3V2Tg"

                return supertest(app)
                    .get(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: {message: `This review does not exist.`}
                    })
            })
        })
    })

    describe('POST /api/reviews', () => {
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
                        .into('reviews')
                        .insert(testReviews)
                })
        })

        it('creates a new review, responding with 201 and that review', function() {
            const newReview = {
                user_id: 3,
                game_id: 'AuBvbISHR6',
                review: 'Takes too long. No fun.',
                rating: 1,
            }

            return supertest(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send(newReview)
                .expect(201)
                .expect(res => {
                    expect(res.body.user_id).to.eql(newReview.user_id)
                    expect(res.body.game_id).to.eql(newReview.game_id)
                    expect(res.body.review).to.eql(newReview.review)
                    expect(res.body.rating).to.eql(newReview.rating)
                    expect(res.body).to.have.property('review_posted')
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/reviews/${res.body.user_id}/${res.body.game_id}`)
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(res.body)
                )
        })

        it('responds with 400 and an error message when required fields are missing', () => {
            return supertest(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .send({})
                .expect(400, {
                    error: {message: 'User_id, game_id, review, and rating are required'}
                })
        })
    })

    describe('DELETE /api/reviews/:user_id/:game_id', () => {
        context('Given an empty table', () => {
            it('responds with 404', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"
                return supertest(app)
                    .delete(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: {message: `This review does not exist.`}
                    })
            })
        })

        context('Given there are reviews in the table', () => {
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
                            .into('reviews')
                            .insert(testReviews)
                    })
            })

            it('responds with 204 and removes the review', () => {
                const userId = 2
                const gameId = "7UFLK3V2Tg"

                return supertest(app)
                    .delete(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/reviews/${userId}/${gameId}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(404, {
                                error: {message: `This review does not exist.`}
                            })
                    )
            })
        })
    })

    describe('PATCH /api/reviews/:user_id/:game_id', () => {
        context('Given no items in table', () => {
            it('responds with 404', () => {
                const userId = 1
                const gameId = "7UFLK3V2Tg"
                return supertest(app)
                    .delete(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: {message: `This review does not exist.`}
                    })
            })
        })

        context('Given there are reviews in the table', () => {
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
                            .into('reviews')
                            .insert(testReviews)
                    })
            })

            it('responds with 204 and updates the item', () => {
                const userId = 2
                const gameId = "7UFLK3V2Tg"
                const updatedField = {
                    review: 'Actually this game is great',
                    rating: 5
                }

                const oldData = testReviews.find(review => review.user_id === userId && review.game_id === gameId)
                const expectedObject = {
                    ...oldData,
                    ...updatedField
                }

                return supertest(app)
                    .patch(`/api/reviews/${userId}/${gameId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(updatedField)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/reviews/${userId}/${gameId}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect({
                                ...expectedObject, review_posted: expectedObject.review_posted.toISOString()
                            })
                    )
            })
        })
    })
})