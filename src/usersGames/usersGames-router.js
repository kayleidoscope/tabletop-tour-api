const path = require('path')
const express = require('express');
const xss = require('xss')
const usersGamesRouter = express.Router();
const UsersGamesService = require('./usersGames-service.js');
const jsonParser = express.json()

usersGamesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const {user_id} = req.query

        if (user_id) {
            UsersGamesService.getGamesOfUser(knexInstance, user_id)
                .then(usersGames => {
                    res.json(usersGames)
                })
                .catch(next)
        } else {
            UsersGamesService.getAllUsersGames(knexInstance)
                .then(usersGames => {
                    res.json(usersGames)
                })
                .catch(next)
        }
    })
    .post(jsonParser, (req, res, next) => {
        const {user_id, game_id, user_played, user_loved, user_saved} = req.body
        const newEntry = {user_id, game_id}

        if (!user_id || !game_id) {
            return res.status(400).json({
                error: {message: 'User_id and game_id are required'}
            })
        }

        newEntry.user_played = user_played
        newEntry.user_loved = user_loved
        newEntry.user_saved = user_saved

        UsersGamesService.insertUsersGame(
            req.app.get('db'),
            newEntry
        )
            .then(usersGame => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${usersGame.user_id}/${usersGame.game_id}`))
                    .json(usersGame)
            })
            .catch(next)
    })

usersGamesRouter
    .route('/:user_id/:game_id')
    .all((req, res, next) => {
        const {user_id, game_id} = req.params
        const knexInstance = req.app.get('db')

        UsersGamesService.getByIds(knexInstance, user_id, game_id)
            .then(usersGame => {
                if (!usersGame) {
                    return res.status(404).json({
                        error: {message: `Users-game item not in system`}
                    })
                }
                res.usersGame = usersGame
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.usersGame)
    })
    .delete((req, res, next) => {
        UsersGamesService.deleteUsersGame(
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
        const {user_id, game_id, user_played, user_loved, user_saved} = req.body
        const updatedFields = {user_id, game_id, user_played, user_loved, user_saved}

        const numOfValues = Object.values(updatedFields).filter(Boolean).length
        if(numOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of the following fields: user_id, game_id, user_played, user_loved, user_saved`
                }
            })

        UsersGamesService.updateUsersGame(
            req.app.get('db'),
            req.params.user_id,
            req.params.game_id,
            updatedFields
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = usersGamesRouter