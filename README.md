# IMPORTANT!
This is a unified repository created solely for the purpose of participating in infoeducatie contest and is updated regularly. To see the most recent, timelined version check the following repositories: [bytecrowds-frontend](https://github.com/TudorZgimbau/bytecrowds-frontend/tree/main), [bytecrowds-database-server](https://github.com/TudorZgimbau/bytecrowds-database-server/tree/main), [bytecrowds-workers](https://github.com/TudorZgimbau/bytecrowds-workers/tree/main) and [bytecrowds-websocket-server](https://github.com/TudorZgimbau/bytecrowds-websocket-server/tree/main)

# bytecrowds
A unified repository for the code-sharing platform Bytecrowds

# How to run?
  - Git clone the [frontend](https://github.com/TudorZgimbau/bytecrowds/tree/main/frontend), [websocket-server](https://github.com/TudorZgimbau/bytecrowds/tree/main/websocket-server)       and [database-server](https://github.com/TudorZgimbau/bytecrowds/tree/main/database-server)
  - Create the .env files and set the variables accordingly


# Tech stack

## Frontend
  * [next](https://nextjs.org/) : the main frontend framework, allows combined SSG and CSR for better performance
  * [SyncedStore](https://syncedstore.org/docs/) : [y.js](https://docs.yjs.dev/) react and [reactive](https://github.com/yousefed/reactive) framework
  * [react-codemirror](https://uiwjs.github.io/react-codemirror/) : [codemirror-6](https://codemirror.net/6/) react implementation
  * [y.js-codemirror](https://github.com/yjs/y-codemirror) : y.js codemirror adapter

  How it works?
  We use the y.js-codemirror bindings on react-codemirror and connect the editor to the global SyncedStore object.
  
## Backend
  * we are using a custom [ably](https://ably.com/) provider for syncing the client and scaling the infrastructure
  * go, specifically the [gin](https://gin-gonic.com/) framework for the database interaction server

## Serverless
  * [cloudflare-workers](https://workers.cloudflare.com/) to run the 2 neccesarry functions: *lazar* to keep the free heroku servers up and *analytics* to intercept the requests and send them to the database server to be processed
