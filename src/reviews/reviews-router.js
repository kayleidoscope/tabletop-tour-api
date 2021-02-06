const path = require('path')
const express = require('express');
const xss = require('xss')
const reviewsRouter = express.Router();
const ReviewsService = require('./reviews-service.js');
const jsonParser = express.json()

reviewsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const {user_id, game_id} = req.query

        if(user_id) {
            ReviewsService.getReviewsByUser(knexInstance, user_id)
                .then(reviews => {
                    res.json(reviews)
                })
                .catch(next)
        } else if (game_id) {
            ReviewsService.getReviewsByGame(knexInstance, game_id)
                .then(reviews => {
                    res.json(reviews)
                })
                .catch(next)
        } else {
            ReviewsService.getAllReviews(knexInstance)
                .then(reviews => {
                    res.json(reviews)
                })
                .catch(next)
        }

    })
    .post(jsonParser, (req, res, next) => {
        const {user_id, game_id, review, rating} = req.body
        const newReview = {user_id, game_id, review, rating}

        if (!user_id || !game_id || !review || !rating) {
            return res.status(400).json({
                error: {message: 'User_id, game_id, review, and rating are required'}
            })
        }

        ReviewsService.insertReview(
            req.app.get('db'),
            newReview
        )
            .then(review => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.user_id}/${review.game_id}`))
                    .json({
                        user_id: review.user_id,
                        game_id: review.game_id,
                        rating: review.rating,
                        review: xss(review.review),
                        review_posted: review.review_posted
                    })
            })
            .catch(next)
    })

reviewsRouter
    .route('/:user_id/:game_id')
    .all((req, res, next) => {
        const {user_id, game_id} = req.params
        const knexInstance = req.app.get('db')

        ReviewsService.getByIds(knexInstance, user_id, game_id)
            .then(review => {
                if (!review) {
                    return res.status(404).json({
                        error: {message: `This review does not exist.`}
                    })
                }
                res.review = review
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            user_id: res.review.user_id,
            game_id: res.review.game_id,
            rating: res.review.rating,
            review: xss(res.review.review),
            review_posted: res.review.review_posted
        })
    })
    .delete((req, res, next) => {
        ReviewsService.deleteReview(
            req.app.get('db'),
            req.params.user_id,
            req.params.game_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {user_id, game_id, review, rating} = req.body
        const newReview = {user_id, game_id, review, rating}

        const numOfValues = Object.values(newReview).filter(Boolean).length
        if(numOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of the following fields: user_id, game_id, review, rating`
                }
            })

        ReviewsService.updateReview(
            req.app.get('db'),
            req.params.user_id,
            req.params.game_id,
            newReview
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = reviewsRouter