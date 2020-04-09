# Lockr

--Description--

## Technologies

- NodeJS
- Bootstrap 4
- JQuery
- SASS
- PostgreSQL

## Project Setup

### 1. Clone

- Clone this repo to your local machine

### 2. Set up your database

- Connect to your postgres server

```shell
psql -U vagrant -d template1
```

- Create the necessary objects in your local development database that will serve as connection credentials

```shell
CREATE ROLE labber WITH LOGIN password 'labber';
CREATE DATABASE midterm OWNER labber;
```

### 3. Set up your credentials in .env file

- Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
- Update the .env file with your correct local information
  - username: `labber`
  - password: `labber`
  - database: `midterm`

### 4. Install dependencies and reset database

- Install dependencies: `npm i`

- Fix to binaries for sass: `npm rebuild node-sass`

- Create tables and seed your database: `npm run db:reset`

- Run the server: `npm run local`

- Visit `http://localhost:8080/`

## Screenshots

![](URL)
![](URL)
![](URL)

## Dependencies

- Bcrypt 3.0.6
- Body-parser 1.19.0
- Chalk 2.4.2
- Cookie-session 1.4.0
- Crypto-js 4.0.0
- Dotenv 2.0.0
- EJS 2.6.2
- Express 4.17.1
- Method-Override 3.0.0
- Morgan 1.9.1
- Node-SASS-Middleware 0.11.0
- PG 6.4.2
- PG-Native 3.0.0

## TEAM

Insert name and github?
