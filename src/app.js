require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { restart } = require('nodemon')
const usersRouter = require('./users/users-router')
const gamesRouter = require('./games/games-router')
const usersGamesRouter = require('./usersGames/usersGames-router')
const reviewsRouter = require('./reviews/reviews-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");
  
    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    // move to the next middleware
    next();
  });

app.use('/api/users', usersRouter)
app.use('/api/games', gamesRouter)
app.use('/api/users-games', usersGamesRouter)
app.use('/api/reviews', reviewsRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app