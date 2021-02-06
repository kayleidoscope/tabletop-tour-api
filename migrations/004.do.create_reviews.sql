CREATE TABLE reviews (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, game_id),
    review TEXT NOT NULL,
    review_posted TIMESTAMPTZ NOT NULL DEFAULT now(),
    rating INTEGER NOT NULL
);