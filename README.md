![main](https://github.com/adikuwar-org/api-service/actions/workflows/node.js.yml/badge.svg?branch=main)

## Description

CSC - API Service

## Pre-requisites

To run and build this project following dependencies must be configured.

- [Typescript](https://www.typescriptlang.org/id/download)
- MongoDB (Either install manually or Deploy on [MongoDB Atlas](https://www.mongodb.com/atlas/database))   
To Setup MongoDB via docker, update `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`, `ME_CONFIG_MONGODB_ADMINUSERNAME` and `ME_CONFIG_MONGODB_ADMINPASSWORD` in `/mongo/docker-compose.yaml` and run:   
`cd mongo`   
`docker-compose -f docker-compose.yaml`   
Access Mongo Express Via URL : `http://localhost:8081/`
- Configure environment variables. See Configure environment variables

## Configure environment variables

1. Create .env file by using .env-template.
2. Update `Username`, `Password`, `Mongo_Host` and `Database_Name` as per your MongoDB Instance.

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
