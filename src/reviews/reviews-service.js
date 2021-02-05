const ReviewsService = {
    getAllReviews(knex) {
        return knex.select('*').from('reviews')
    },
    getByIds(knex, user_id, game_id) {
        return knex
            .from('reviews')
            .select('*')
            .where({user_id})
            .where({game_id})
            .first()
    },
    getReviewsByUser(knex, user_id) {
        return knex
            .from('reviews')
            .select('*')
            .where({user_id})
    },
    getReviewsByGame(knex, game_id) {
        return knex
            .from('reviews')
            .select('*')
            .where({game_id})
    },
    deleteReview(knex, user_id, game_id) {
        return knex('reviews')
            .where({user_id})
            .where({game_id})
            .delete()
    },
    updateReview(knex, user_id, game_id, newFields) {
        return knex('reviews')
        .where({user_id})
        .where({game_id})
        .update(newFields)
    },
    insertReview(knex, newReview) {
        return knex
            .insert(newReview)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = ReviewsService