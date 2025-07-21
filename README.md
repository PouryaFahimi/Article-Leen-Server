# Article Server Leen(!?)

Welcome to this repo, here we have Article-Leen Server which is actually the back-end part of [Article-Leen](https://github.com/PouryaFahimi/Article-Leen) and serves as a data provider to client as it pulls the data from the heart of the database and respectfully sends it.

### Tech Stack

**Server**: Node.js, Express, MongoDB  
**Auth**: JWT

### Brief Explanation

Article-Leen Server is a Node.js backend application built with Express.js that handles data transmission via HTTP requests through its REST API routes. It processes incoming data by creating structured objects based on MongoDB schema models and seamlessly stores them in the database.

## Installation

First clone this repository, then install dependencies:

    npm install

And install the Docker Engine, if you haven't installed yet and it's good to take a look at it's [installation guide](https://docs.docker.com/engine/install/).

### Setting up Database

To connect the MongoDB to server, run this command:

    docker compose up -d

Based on the `docker-compose.yml` file, this command tells Docker to pull the mongo image and create it's container (if not already created), then start the container and run MongoDB inside it, and mount the `./mongo-data` directory for persistent storage.

Then run the `server.js` with Node.

    node server.js

And to disconnect the database run this one:

    docker compose down

## API Endpoints

API routes and description:

- **/api/articles**

  - `GET /` - fetch all articles
  - `GET /search` - fetch searched articles
  - `GET /:articleId` - fetch one article by Id
  - `GET /user/:username` - fetch all articles of one user
  - `POST /` - create new article
  - `PUT /:id` - update an article
  - `DELETE /:articleId` - delete an article

- **/api/auth**

  - `POST /register` - register new user
  - `POST /login` - user login

- **/api/user**

  - `GET /:username` - fetch one user info
  - `GET /search` - fetch searched users

- **/api/likes**

  - `POST /:articleId` - like an article
  - `DELETE /:articleId` - unlike
  - `GET /user` - fetch liked articles of current user

- **/api/bookmarks**

  - `POST /:articleId` - bookmark an article
  - `DELETE /:articleId` - remove a bookmark
  - `GET /` - fetch bookmarks of current user
