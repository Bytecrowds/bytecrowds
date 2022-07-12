# IMPORTANT!
This is a unified repository created solely for the purpose of participating in infoeducatie contest and is updated regularly. To see the most recent, timelined version check the [frontend](https://github.com/Bytecrowds/frontend) and [backend](https://github.com/Bytecrowds/backend) repositories.

# bytecrowds
A unified repository for the code sharing platform Bytecrowds

# How to run?
  - Git clone the [frontend](https://github.com/Bytecrowds/frontend) and [backend](https://github.com/Bytecrowds/backend) repositories;
  - Create the .env files and set the variables accordingly;
  - IMPORTANT! Because of an underlying [issue](https://github.com/YousefED/reactive/issues/8) on [reactive](https://github.com/YousefED/reactive), the react dependecy of the library needs to be manually deleted.


# Tech stack

## Frontend
  * [next](https://nextjs.org/) : the main frontend framework, allows combined SSG and CSR for better performance;
  * [SyncedStore](https://syncedstore.org/docs/) : [y.js](https://docs.yjs.dev/) react and [reactive](https://github.com/yousefed/reactive) framework;
  * [react-codemirror](https://uiwjs.github.io/react-codemirror/) : [codemirror-6](https://codemirror.net/6/) react implementation;
  * [y.js-codemirror](https://github.com/yjs/y-codemirror) : y.js codemirror adapter.
  
## Serverless Backend
  * we are using a custom [Ably](https://ably.com/) provider for syncing the clients 
  * [cloudflare-workers](https://workers.cloudflare.com/) for interacting with the database 
  * [upstash](https://upstash.com/) for persisting the data to redis
  
##  How it works?
  We use the y.js-codemirror bindings on react-codemirror and connect the editor to the global SyncedStore object, together with the Ably provider. The infrastructure can auto-scale to any number of users
  
