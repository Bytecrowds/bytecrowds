# IMPORTANT!
This is a unified repository created solely for the purpose of participating in infoeducatie contest and is updated regularly. To see the most recent, timelined version check the [frontend](https://github.com/Bytecrowds/frontend) and [backend](https://github.com/Bytecrowds/backend) repositories.

# Description
> What's Bytecrowds?

Bytecrowds is a simple and reliable serverless code sharing platform, which goal is to allow programmers to share code with peers in seconds.

> How does it differ from other code sharing platforms?

The infrastructure we use relies on serverless functions to maximize the reability of the app, making requests on edge and auto-scaling

> Why serverless?

Serverless allows us to focus on code rather than infrastructure operations, which can cause a lot of problems when you need maximum stability and scaling.

> Isn't serverless emptying pockets with that many requests/second?

The short answer would be no. We use [Ably](https://ably.com/) to sync the peers which is a serverless solution created specially for real-time services.
Also, although we are sending a large number of requests to workers and DB, we also don't have any concerns about the speed and realibility of the app, which at scale can become a really challenging cost to deal with, both time and money wise.

# Architecture
![architecture](./assets/bytecrowds.drawio.png)

## Data
The data collected from the platform is stored using redis data types and cloudflare workers KV:
  * a bytecrowd is stored as a redis hash having the following properties:
    * text => string
    * language => string
    * requiresAuth => bool
    * allowedIPs => string[]
  * the analytics data is stored as follows: 
    * a day's data is stored as a redish hash having the following properties:
      * hits => int
      * addresses => string[]
      * uniqueVisitors => int
      * countries => string[]
      * continents => string[]
      * pages => string[]
    * the general stats are stored as sorted sets as follows:
      * continents => { continent: string, score: int }[]
      * countries => { country: string, score: int }[]
      * pages => { page: string, score: int }[]
  * the bytecrowds's passwords are stored as cloudflare workers KV as follows:
      * name: password => string: string

# Analytics
Bytecrowds uses a custom analytics engine that sends the current page (with the rest of the data being processed server-side) to a worker the first time a page renders. We then create and update daily and general stats representing the app usage.

# Security
All data retrieving routes except for one are protected using IP-based authorization, meaning only IP's in the whitelist are allowed to call them. For properly retrieving the data server-side on frontend, the /bytecrowd/:bytecrowd route gives all the data regardless of the authorization state. But, to ensure that the route is called only from within the app, we verify the requests using a custom header with a secret value stored on the .ENV files. Also, we ensure that the request is made:
   * on the server side when using the IP authentication to prevent leaking the authorization header value
   * on the client side when using the password authentication because it doesn't retrieve any data and is used only for closing the auth modal
On the frontend, the data is not being rendered if the auth modal is open

The bytecrowds's passwords are stored using cloudflare workers KV which are encrypted at rest with 256-bit AES-GCM, and only decrypted by the process executing the worker scripts or responding to API requests.


# How to run?
  - Git clone the [frontend](https://github.com/Bytecrowds/frontend) and [backend](https://github.com/Bytecrowds/backend) repositories
  - Create the .env files and set the variables accordingly
  - (optional) Install [wrangler](https://github.com/cloudflare/wrangler2) and deploy a local version of the workers
  - IMPORTANT! Because of an underlying [issue](https://github.com/YousefED/reactive/issues/8) on [reactive](https://github.com/YousefED/reactive), the react dependecy of the library needs to be manually deleted


# Tech stack

## Frontend
  * [next](https://nextjs.org/) : the main frontend framework, allows combined SSG and CSR for better performance
  * [SyncedStore](https://syncedstore.org/docs/) : [y.js](https://docs.yjs.dev/) react and [reactive](https://github.com/yousefed/reactive) framework
  * [react-codemirror](https://uiwjs.github.io/react-codemirror/) : [codemirror-6](https://codemirror.net/6/) react implementation
  * [y.js-codemirror](https://github.com/yjs/y-codemirror) : y.js codemirror adapter
  
## Serverless Backend
  * we are using a custom [Ably](https://ably.com/) provider for syncing the clients 
  * [cloudflare-workers](https://workers.cloudflare.com/) for interacting with the database 
  * [upstash](https://upstash.com/) for persisting the data to redis
  
##  How it works?
  We use the y.js-codemirror bindings on react-codemirror and connect the editor to the global SyncedStore object, together with the Ably provider. The infrastructure can auto-scale to any number of users.
  
