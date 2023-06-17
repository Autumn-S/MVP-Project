DROP TABLE IF EXISTS characters;

CREATE TABLE characters(
   characterId SERIAL PRIMARY KEY NOT NULL,
   char_name VARCHAR(50) NOT NULL,
   char_level INT NOT NULL,
   char_class VARCHAR(30) NOT NULL
);