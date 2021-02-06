const {expect} = require("chai")
const knex = require('knex')
const ReviewsService = require('../src/reviews/reviews-service')
const {makeReviewsArray} = require('./reviews-fixtures')
const {makeGamesArray} = require('./games-fixtures')
const {makeUsersArray} = require('./users-fixtures')

describe('Reviews service object', function () {
    let db;

    let testReviews = makeReviewsArray()
    let testGames = makeGamesArray()
    let testUsers = makeUsersArray()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
    })

    before(() => db.raw('TRUNCATE users, games, reviews RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE users, games, reviews RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    context('Given reviews has data', () => {
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

        it('getAllReviews() resolves a list of all reviews from the table', ()  => {
            return ReviewsService.getAllReviews(db)
                .then(actual => {
                    expect(actual).to.eql(testReviews)
                })
        })
        it('getByIds() resolves a single review', () => {
            const userId = 1
            const gameId = 'AuBvbISHR6'

            const expected = testReviews.find(review => (review.user_id === userId) && (review.game_id === gameId))
            return ReviewsService.getByIds(db, userId, gameId)
                .then(actual => {
                    expect(actual).to.eql(expected)
                })
        })
        it('getReviewsByUser() resolves all reviews made by a user', () => {
            const userId = 1

            const expected = testReviews.filter(review => review.user_id === userId)

            return ReviewsService.getReviewsByUser(db, userId)
                .then(actual => {
                    expect(actual).to.eql(expected)
                })
        })
        it('getReviewsByGame() resolves all reviews for a game', () => {
            const gameId = 'AuBvbISHR6'
            const expected = testReviews.filter(review => review.game_id === gameId)

            return ReviewsService.getReviewsByGame(db, gameId)
                .then(actual => {
                    expect(actual).to.eql(expected)
                })
        })
        it('deleteReview() removes a review', () => {
            const userId = 1
            const gameId = 'AuBvbISHR6'

            return ReviewsService.deleteReview(db, userId, gameId)
                .then(() => ReviewsService.getAllReviews(db))
                .then(allReviews => {
                    const expected = testReviews.filter(review => !(review.user_id === userId && review.game_id === gameId))
                    expect(allReviews).to.eql(expected)
                })
        })
        it('updateReview() updates a review', () => {
            const userId = 2
            const gameId = '7UFLK3V2Tg'

            const newFields = {
                review: 'We figured out the rules. This game rocks!',
                rating: 5
            }

            const reviewData = testReviews.find(review => (review.user_id === userId) && (review.game_id === gameId))
            
            return ReviewsService.updateReview(db, userId, gameId, newFields)
                .then(() => ReviewsService.getByIds(db, userId, gameId))
                .then(review => {
                    expect(review).to.eql({
                        game_id: gameId,
                        user_id: userId,
                        rating: newFields.rating,
                        review: newFields.review,
                        review_posted: reviewData.review_posted
                    })
                })
        })
    })

    context('Given reviews has no data', () => {
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

        it('getAllReviews() resolves an empty array', () => {
            return ReviewsService.getAllReviews(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it('insertReview() inserts a new review', () => {
            const newReview = testReviews[0]
            return ReviewsService.insertReview(db, newReview)
                .then(actual => {
                    expect(actual).to.eql(newReview)
                })
        })
    })
})