ALTER TABLE users_games
    DROP COLUMN user_id,
    DROP COLUMN game_id;

DROP TABLE IF EXISTS users_games;