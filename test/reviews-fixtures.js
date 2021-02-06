function makeReviewsArray() {
    return [
        {
            user_id: 1,
            game_id: 'AuBvbISHR6',
            review: 'This game is so fun!! I love how strategic it is.',
            rating: 4,
            review_posted: new Date('2021-01-22T16:28:32.615Z')
        },
        {
            user_id: 2,
            game_id: '7UFLK3V2Tg',
            review: 'Cool premise, but I had trouble understanding how to play it.',
            rating: 2,
            review_posted: new Date('2021-01-22T16:28:32.615Z')
        },
        {
            user_id: 1,
            game_id: 'uOhZRZa3xN',
            review: 'If you rock at 3-letter words like me, this game will be your jam.',
            rating: 5,
            review_posted: new Date('2021-01-22T16:28:32.615Z')
        }
    ]
}

module.exports = {
    makeReviewsArray
}