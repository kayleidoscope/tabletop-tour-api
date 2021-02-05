CREATE TABLE users_games (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, game_id),
    user_played BOOLEAN DEFAULT 'false',
    user_loved BOOLEAN DEFAULT 'false',
    user_saved BOOLEAN DEFAULT 'false'
);