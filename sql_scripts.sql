-- -- Create User table
-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(100) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL
-- );

-- -- Create UserScore table
-- CREATE TABLE user_scores (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) UNIQUE,
--     score INTEGER DEFAULT 0
-- );

-- Add sample data for users
INSERT INTO scores_user (username, email) VALUES
    ('john_doe', 'john@example.com'),
    ('jane_smith', 'jane@example.com'),
    ('bob_johnson', 'bob@example.com');

-- Add sample data for user scores
INSERT INTO scores_userscore (user_id, score) VALUES
    (1, 100),
    (2, 150),
    (3, 120);
