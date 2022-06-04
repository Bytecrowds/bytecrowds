import { Router } from 'itty-router';

const router = new Router();

router.get("/", request => {
  return new Response("Welcome to the analytics worker for bytecrowds.com");
})

router.get("/analytics/:page", async request => {
  let cfData =
    request.cf !== undefined ?
      request.cf : { error: "The `cf` object is not available inside the preview." }

  let data = {};
  for (let prop in cfData)
    data[prop] = cfData[prop];

  data.requestIP = request.headers.get("CF-Connecting-IP");

  let analytics = {
      IP: data.requestIP,
      continent: data.continent,
      page: request.params.page
  }

  await fetch("https://bytecrowds-database-server.herokuapp.com/analytics", {
    method: "POST",
    headers: {
      "Content-Type" : "appplication/json"
    },
    body: JSON.stringify(analytics)
  })

  return new Response(
    JSON.stringify(data, null, 2), {
    headers: { 
      'Content-type': "application/json;charset=UTF-8",
      'Access-Control-Allow-Origin': '*',
     },
  })
})


addEventListener("fetch", event => {
  return event.respondWith(router.handle(event.request))
})