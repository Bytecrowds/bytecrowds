addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event));
})

async function handleRequest(request) {
  return new Response('Hello!', {
    headers: { 'content-type': 'text/plain' },
  })
}

async function handleScheduled(request) {
  await fetch("https://bytecrowds-database-server.herokuapp.com");
  await fetch("https://bytecrowds-websocket-server.herokuapp.com");
  await fetch("https://bytecrowds-frontend.vercel.app/cpp");
  return new Response('Succes', {
    headers: { 'content-type': 'text/plain' },
  })
}
