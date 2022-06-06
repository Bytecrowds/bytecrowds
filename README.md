# bytecrowds
A unified repository for the code-sharing platform Bytecrowds

# How to run?
  - Git clone the [frontend](https://github.com/TudorZgimbau/bytecrowds/tree/main/frontend), [websocket-server](https://github.com/TudorZgimbau/bytecrowds/tree/main/websocket-server)       and [database-server](https://github.com/TudorZgimbau/bytecrowds/tree/main/database-server)
  - Create the .env files and set the variables accordingly


# Tech stack

## Frontend
  * [next](https://nextjs.org/) : the main frontend framework, allows combined SSG and CSR for better performance
  * [SyncedStore](https://syncedstore.org/docs/) : [yjs](https://docs.yjs.dev/) react and [reactive](https://github.com/yousefed/reactive) framework
  * [react-codemirror](https://uiwjs.github.io/react-codemirror/) : [codemirror-6](https://codemirror.net/6/) react implementation
  * [yjs-codemirror](https://github.com/yjs/y-codemirror) : yjs codemirror adapter

  How it works?
  We use the yjs-codemirror bindings on react-codemirror and connect the editor to the global SyncedStore object.
  
## Backend
  * [ws](https://www.npmjs.com/package/ws) as the node websockets implementation
  * go, specifically the [gin](https://gin-gonic.com/) framework for the database interaction server

## Serverless
  * [cloudflare-workers](https://workers.cloudflare.com/) to run the 2 neccesarry functions: *lazar* to keep the free heroku servers up and *analytics* to intercept the requests and send them to the database server to be processed
