# Tabletop Tour API

Used in conjunction with the Tabletop Tour app, this API provides the functionality for finding, logging, and reviewing tabletop games.

You can also view the [live site](https://tabletop-tour.vercel.app/game/fG5Ax8PA7n) or visit the [frontend repo](https://github.com/kayleidoscope/tabletop-tour-app).

This API is not open for public use at this time, but is CORS compatible. The API will respond with a JSON object.

## Endpoints

### /users

Route | Request | Body | Result
----- | ------- | ------ | ------
/users | GET | | returns all users
/users | POST | username | creates a new user
/users/:id | GET | | returns the user with that ID
/users/:id | DELETE | | deletes the user with that ID
/users/:id | PATCH | | updates a user's username

Query param | Type
----------- | ----
id | number
username | string
acct_created | date-time

### /games

An asterisk (*) indicates a required query parameter.

Route | Request | Body | Query params | Result
----- | ------- | ---- | ------ | ------
/games | GET | | | returns all games
/games | POST | *id, *name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image | | adds a new game to the database
/games/:id | GET | | | returns the story with that ID
/games/:id | DELETE | | | deletes the story with that ID
/games/:id | PATCH | *one of the following: id, name, min_players, msrp, max_players, min_playtime, max_playtime, min_age, description, rules, small_image, medium_image, original_image | | updates a story

Query param | Type
----------- | ----
id | string
name | string
min_players | number
max_players | number
msrp | numeric
min_playtime | number
max_playtime | number
min_age | number
description | string
rules | string
small_image | string
medium_image | string
original_image | string

## /users-games

An asterisk (*) indicates a required query parameter.

Route | Request | Body | Query params | Result
----- | ------- | ---- | ------------ | ------
/users-games | GET | | | returns all relationships between users and games
/users-games | GET | | *user_id | returns all games associated with that user
/users-games | POST | *user_id, *game_id, user_played, user_loved, user_saved | | creates a new relationship between a user and a game
/users-games/:user_id/:game_id | GET | | | returns the users-game relationship with those IDs
/users-games/:user_id/:game_id | DELETE | | | deletes the users-game relationship with those IDs
/users-games/:user_id/:game_id | PATCH | *at least one of the following: user_id, game_id, user_played, user_loved, user_saved | | updates a users-game relationship

Note: user_played, user_loved, and user_saved will default to false

Query param | Type
----------- | ----
user_id | number
game_id | string
user_played | boolean
user_loved | boolean
user_saved | boolean

## /reviews

An asterisk (*) indicates a required parameter.

Route | Request | Body | Query params | Result
----- | ------- | ---- | ------------ | ------
/reviews | GET | | | returns all reviews
/reviews | GET | | *user_id | returns reviews for that user
/reviews | GET | | *game_id | returns reviews for that game
/reviews | POST | *user_id, *game_id, *review, *rating | | creates a new review
/reviews/:user_id/:game_id | GET | | | returns the review with those IDs
/reviews/:user_id/:game_id | DELETE | | | deletes the review with those IDs
/reviews/:user_id/:game_id | PATCH | *at least one of the following: user_id, game_id, review, rating | updates a review

Query param | Type
----------- | ----
story_id | number
name | string
description | string
decor | string
is_residence | boolean (defaults to false)

## Status codes

Code | Endpoint | Request | Possible reason
---- | --------------- | ------ | -------
500 | any | any | Server error
200 | any | GET | Data was successfully returned.
201 | any | POST | Your POST was successful.
204 | any with an id path param | PATCH | Your entry was successfully updated.
204 | any with an id path param | DELETE | Your entry was successfully deleted.
400 | any | POST | A required query param in the body is missing.
404 | any with an id path param | GET, DELETE, or PATCH | An entry with that ID doesn't exist.
400 | any with an id path param | PATCH | You must include at least one of the query params in the body.

## Tech Stack

* Javascript
* React
* Node.js
* Postgres
* HTML
* CSS