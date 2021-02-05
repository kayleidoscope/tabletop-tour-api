function makeUsersGamesArray() {
    return [
        {
            user_id: 1,
            game_id: 'AuBvbISHR6',
            user_played: true,
            user_loved: true,
            user_saved: false
        },
        {
            user_id: 1,
            game_id: '7UFLK3V2Tg',
            user_played: false,
            user_loved: false,
            user_saved: true
        },
        {
            user_id: 1,
            game_id: 'uOhZRZa3xN',
            user_played: true,
            user_loved: true,
            user_saved: false
        }
    ]
}

module.exports = {
    makeUsersGamesArray
}