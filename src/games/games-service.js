const GamesService = {
    getAllGames(knex) {
        return knex.select('*').from('games')
    },
    getById(knex, id) {
        return knex
            .from('games')
            .select('*')
            .where({id})
            .first()
    },
    deleteGame(knex, id) {
        return knex('games')
            .where({id})
            .delete()
    },
    updateGame(knex, id, newFields) {
        return knex('games')
            .where({id})
            .update(newFields)
    },
    insertGame(knex, newGame) {
        return knex
            .insert(newGame)
            .into('games')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = GamesService