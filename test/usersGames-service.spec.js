const {expect} = require("chai")
const knex = require('knex')
const UsersGamesService = require('../src/usersGames/usersGames-service')
const {makeUsersGamesArray} = require('./usersGames-fixtures')
const {makeGamesArray} = require('./games-fixtures')
const {makeUsersArray} = require('./users-fixtures')


describe.only(`Users' games service object`, function () {
    let db;

    let testUsersGames = makeUsersGamesArray()
    let testGames = makeGamesArray()
    let testUsers = makeUsersArray()


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
    })

    before(() => db.raw('TRUNCATE users, games, users_games RESTART IDENTITY CASCADE'))

    afterEach(() => db.raw('TRUNCATE users, games, users_games RESTART IDENTITY CASCADE'))

    after(() => db.destroy())

    context(`Given users_games has data`, () => {
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

        it('getAllUsersGames() resolves a list of all user-game relationships from the table', () => {
            return UsersGamesService.getAllUsersGames(db)
                .then(actual => {
                    expect(actual).to.eql(testUsersGames)
                })
        })
        it('getByIds() resolves a single user-game relationship from the table', () => {
            const userId = 1
            const gameId = "7UFLK3V2Tg"

            const expected = testUsersGames.find(usersGame => (usersGame.user_id === userId) && (usersGame.game_id === gameId))

            return UsersGamesService.getByIds(db, userId, gameId)
                .then(actual => {
                    expect(actual).to.eql(expected)
                })
        })
        it('getGamesOfUser() resolves a list of user-game relationships from a single user', () => {
            const userId = 1

            const expected = testUsersGames.filter(usersGame => (usersGame.user_id === userId))
            return UsersGamesService.getGamesOfUser(db, userId)
                .then(actual => {
                    expect(actual).to.eql(expected)
                })
        })
        it('deleteUsersGame() removes a user-game relationship', () => {
            const userId = 1
            const gameId = "7UFLK3V2Tg"

            return UsersGamesService.deleteUsersGame(db, userId, gameId)
                .then(() => UsersGamesService.getAllUsersGames(db))
                .then(allUsersGames => {
                    const expected = testUsersGames.filter(usersGame => !(usersGame.user_id === userId && usersGame.game_id === gameId))
                    expect(allUsersGames).to.eql(expected)
                })
        })
        it('updateUsersGame() updates a user-game relationship', () => {
            const userId = 1
            const gameId = "7UFLK3V2Tg"

            const newValue = {
                user_played: true
            }

            const usersGameData = testUsersGames.find(usersGame => (usersGame.user_id === userId) && (usersGame.game_id === gameId))

            return UsersGamesService.updateUsersGame(db, userId, gameId, newValue)
                .then(() => UsersGamesService.getByIds(db, userId, gameId))
                .then(usersGame => {
                    expect(usersGame).to.eql({
                        user_played: newValue.user_played,
                        user_loved: usersGameData.user_loved,
                        user_id: userId,
                        game_id: gameId,
                        user_saved: usersGameData.user_saved
                    })
                })
        })
    })

    context('Given users_games has no data', () => {
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

        it('getAllUsersGames() resolves an empty array', () => {
            return UsersGamesService.getAllUsersGames(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it('insertUsersGame() inserts a new user-game relationship', () => {
            const newUsersGame = testUsersGames[0]
            return UsersGamesService.insertUsersGame(db, newUsersGame)
                .then(actual => {
                    expect(actual).to.eql(newUsersGame)
                })
        })
    })
})