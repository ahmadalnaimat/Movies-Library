CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_path VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255) NOT NULL,
    overview TEXT NOT NULL
);