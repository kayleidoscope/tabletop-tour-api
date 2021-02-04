const {expect} = require("chai")
const knex = require('knex')
const GamesService = require('../src/games/games-service')
const {makeGamesArray} = require('./games-fixtures')

describe.only(`Games service object`, function() {
    let db;

    let testGames = makeGamesArray()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
    })

    before(() => db.raw('TRUNCATE games'))

    afterEach(() => db.raw('TRUNCATE games'))

    after(() => db.destroy())

    context(`Given 'games' has data`, () => {
        beforeEach(() => {
            return db
                .into('games')
                .insert(testGames)
        })
        it('getAllGames() resolves a list of games from the games table', () => {
            return GamesService.getAllGames(db)
                .then(actual => {
                    expect(actual).to.eql(testGames)
                })
        })
        it(`getById() resolves a game by id from 'games'`, () => {
            const id = "7UFLK3V2Tg";
            const expectedGame = testGames.find(game => game.id === id)

            return GamesService.getById(db, id)
                .then(actual => {
                    expect(actual).to.eql({
                        id: id,
                        name: expectedGame.name,
                        data_entered: expectedGame.data_entered,
                        description: expectedGame.description,
                        max_players: expectedGame.max_players,
                        max_playtime: expectedGame.max_playtime,
                        min_players: expectedGame.min_players,
                        medium_image: expectedGame.medium_image,
                        min_age: expectedGame.min_age,
                        min_players: expectedGame.min_players,
                        min_playtime: expectedGame.min_playtime,
                        msrp: expectedGame.msrp,
                        original_image: expectedGame.original_image,
                        rules: expectedGame.rules,
                        small_image: expectedGame.small_image
                    })
                })
        })
        it('deleteGame() removes a game by id from games', () => {
            const id = "7UFLK3V2Tg"

            return GamesService.deleteGame(db, id)
                .then(() => GamesService.getAllGames(db))
                .then(allGames => {
                    const expected = testGames.filter(game => game.id !== id)
                    expect(allGames).to.eql(expected)
                })
        })
        it('updateGame() updates a game from the games table', () => {
            const id = "7UFLK3V2Tg"
            const newData = {
                name: "Ticket to Ride: USA",
                msrp: "40",
                description: "This is a much shorter description"
            }
            const expectedGame = testGames.find(game => game.id === id)

            return GamesService.updateGame(db, id, newData)
                .then(() => GamesService.getById(db, id))
                .then(game => {
                    expect(game).to.eql({
                        id: id,
                        name: newData.name,
                        data_entered: expectedGame.data_entered,
                        description: newData.description,
                        max_players: expectedGame.max_players,
                        max_playtime: expectedGame.max_playtime,
                        min_players: expectedGame.min_players,
                        medium_image: expectedGame.medium_image,
                        min_age: expectedGame.min_age,
                        min_players: expectedGame.min_players,
                        min_playtime: expectedGame.min_playtime,
                        msrp: newData.msrp,
                        original_image: expectedGame.original_image,
                        rules: expectedGame.rules,
                        small_image: expectedGame.small_image
                    })
                })
        })
    })

    context('Given games has no data', () => {
        it('getAllGames() resolves an empty array', () => {
            return GamesService.getAllGames(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it('insertGame() inserts a game', () => {
            const newGame = testGames[0]
            return GamesService.insertGame(db, newGame)
                .then(actual => {
                    expect(actual).to.eql(newGame)
                })
        })
    })
})