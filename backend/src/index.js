import Router from "@tsndr/cloudflare-worker-router";
import { Redis } from "@upstash/redis/cloudflare";

const router = new Router();

const redis = new Redis({
  url: "<UPSTASH_REDIS_REST_URL>",
  token: "<UPSTASH_REDIS_REST_TOKEN>",
});

router.get("/bytecrowd/:bytecrowd", async ({ req, res }) => {
  const bytecrowd = await redis.hgetall(req.params.bytecrowd);

  if (bytecrowd !== null) res.body = bytecrowd;
  else res.body = {};
});

router.post("/update", async ({ req, res }) => {
  let name, text, language;
  name = req.body.name;
  text = req.body.text;
  language = req.body.language;
  if (!(await redis.exists(name)))
    await redis.hmset(name, { text: text, language: "javascript()" });
  else {
    const storedBytecrowd = await redis.hgetall(name);
    if (
      storedBytecrowd.text !== text ||
      storedBytecrowd.language !== language
    ) {
      if (!text) text = storedBytecrowd.text;
      if (!language) language = storedBytecrowd.language;
      await redis.hmset(name, { text: text, language: language });
    }
  }
});

export default {
  async fetch(request, env) {
    return router.handle(env, request);
  },
};
