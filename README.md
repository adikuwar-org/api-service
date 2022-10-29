![main](https://github.com/adikuwar-org/api-service/actions/workflows/node.js.yml/badge.svg?branch=main)

## Description

CSC - API Service

## Pre-requisites

To run and build this project following dependencies must be configured.

- [Typescript](https://www.typescriptlang.org/id/download)
- MongoDB (Either install manually or Deploy on [MongoDB Atlas](https://www.mongodb.com/atlas/database))   
To Setup MongoDB via docker, create `/mongo/.env` file from `/mongo/.template.env` and update `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD` and `ME_CONFIG_MONGODB_URL` and run:      
`docker compose -f .\mongo\docker-compose.yaml up -d`   
To stop and remove MongoDB run:   
`docker compose -f .\mongo\docker-compose.yaml down -v`   
Access Mongo Express Via URL : `http://localhost:8081/`
- Configure environment variables. See Configure environment variables

## Configure environment variables

1. Create .env file by using .template.env.
2. Update `Username`, `Password`, `Mongo_Host` and `Database_Name` as per your MongoDB Instance.
3. Configure details for Initial Admin User. Update `ADMIN_USERNAME`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME` and `ADMIN_PASSWORD`
4. Configure details for JWT. Update `JWT_SECRET_KEY` and `JWT_EXPIRES_IN`
5. Configure Rate Limiting for api endpoints. Update `THROTTLE_TTL` and `THROTTLE_LIMIT`.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# unit tests in debug mode
$npm run test:debug

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# integration tests
$ npm run test:integ
```

## Linting

- Install and configure [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) on vscode.
- to Manually lint execute : `npm run lint`
