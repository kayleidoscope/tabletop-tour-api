ALTER TABLE reviews
    DROP COLUMN user_id,
    DROP COLUMN game_id;

DROP TABLE IF EXISTS reviews;