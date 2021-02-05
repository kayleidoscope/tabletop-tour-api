const { KnexTimeoutError } = require("knex")

const UsersGamesService = {
    getAllUsersGames(knex) {
        return knex.select('*').from('users_games')
    },
    getByIds(knex, user_id, game_id) {
        return knex
            .from('users_games')
            .select('*')
            .where({user_id})
            .where({game_id})
            .first()
    },
    getGamesOfUser(knex, user_id) {
        return knex
            .from('users_games')
            .select('*')
            .where({user_id})
    },
    deleteUsersGame(knex, user_id, game_id) {
        return knex('users_games')
            .where({user_id})
            .where({game_id})
            .delete()
    },
    updateUsersGame(knex, user_id, game_id, newFields) {
        return knex('users_games')
        .where({user_id})
        .where({game_id})
        .update(newFields)
    },
    insertUsersGame(knex, newUsersGame) {
        return knex
            .insert(newUsersGame)
            .into('users_games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = UsersGamesService