function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'Tessa Testerson',
            acct_created: new Date('2021-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            username: 'Danny Dummy',
            acct_created: new Date('2021-01-22T16:28:32.615Z')
        },
        {
            id: 3,
            username: 'Polly Pretend',
            acct_created: new Date('2021-01-22T16:28:32.615Z')
        }
    ]
}

module.exports = {
    makeUsersArray,
}