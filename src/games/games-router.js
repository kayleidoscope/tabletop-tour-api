const path = require('path')
const express = require('express');
const gamesRouter = express.Router();
const GamesService = require('./games-service.js');
const jsonParser = express.json()

gamesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        GamesService.getAllGames(knexInstance)
            .then(games => {
                res.json(games)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image} = req.body
        const newGame = {id, name}

        if (!id || !name) {
            return res.status(400).json({
                error: {message: 'An id and name are required'}
            })
        }

        newGame.min_players = min_players
        newGame.msrp = msrp
        newGame.max_players = max_players
        newGame.min_playtime = min_playtime
        newGame.max_playtime = max_playtime
        newGame.min_age = min_age
        newGame.description = description
        newGame.rules = rules
        newGame.small_image = small_image
        newGame.medium_image = medium_image
        newGame.original_image = original_image

        GamesService.insertGame(
            req.app.get('db'),
            newGame
        )
            .then(game => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${game.id}`))
                    .json(game)
            })
            .catch(next)
    })

gamesRouter
    .route('/:id')
    .all((req, res, next) => {
        const {id} = req.params
        const knexInstance = req.app.get('db')
        GamesService.getById(knexInstance, id)
            .then(game => {
                if (!game) {
                    return res.status(404).json({
                        error: {message: `Game not in system`}
                    })
                }
                res.game = game
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.game)
    })
    .delete((req, res, next) => {
        GamesService.deleteGame(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image} = req.body
        const gameToUpdate = {id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image}

        const numOfValues = Object.values(gameToUpdate).filter(Boolean).length
        if(numOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of the following fields: id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, or original_image`
                }
            })

        GamesService.updateGame(
            req.app.get('db'),
            req.params.id,
            gameToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = gamesRouter