import Router from "@tsndr/cloudflare-worker-router";
import { Redis } from "@upstash/redis/cloudflare";

const router = new Router();

// Because cloudflare workers expose the env on fetch, we need to manually set the vars.
const bytecrowds = new Redis({
  url: "BYTECROWDS_URL",
  token: "BYTECROWDS_TOKEN",
});

const analytics = new Redis({
  url: "ANALYTICS_URL",
  token: "ANALYTICS_TOKEN",
});

router.get("/bytecrowd/:bytecrowd", async ({ req, res }) => {
  const bytecrowd = await bytecrowds.hgetall(req.params.bytecrowd);

  if (bytecrowd !== null) res.body = bytecrowd;
  else res.body = {};
});

router.post("/update", async ({ req, res }) => {
  let name, text, language;
  name = req.body.name;
  text = req.body.text;
  language = req.body.language;

  const storedBytecrowd = await bytecrowds.hgetall(name);
  if (!storedBytecrowd)
    // If the bytecrowd doesn't exist, create it.
    await bytecrowds.hmset(name, { text: text, language: "javascript" });
  else if (
    // If at least one element(text/language) changed , update the bytecrowd.
    storedBytecrowd.text !== text ||
    storedBytecrowd.language !== language
  ) {
    // If the request doesn't contain a new text/language, use the current one.
    if (!text) text = storedBytecrowd.text;
    if (!language) language = storedBytecrowd.language;
    await bytecrowds.hmset(name, { text: text, language: language });
  }
});

router.post("/analytics", async ({ req, res }) => {
  const _updateArray = (name, stat) => {
    // Update the day stats arrays if required.
    const array = storedDayStat[name];

    let didUpdate = false;
    if (!array.includes(stat)) {
      didUpdate = true;
      array.push(stat);
    }
    return {
      updatedArray: array,
      didUpdate: didUpdate,
    };
  };

  const requestStats = {
    page: req.body.page,
    country: req.cf.country,
    continent: req.cf.continent,
    requestIP: req.headers.get("CF-Connecting-IP"),
  };

  const _date = new Date();
  const date =
    // Months range from 0 to 11 so we need to increment by 1 to get the real value.
    _date.getFullYear() + " " + (_date.getMonth() + 1) + " " + _date.getDate();

  const storedDayStat = await analytics.hgetall(date);
  if (!storedDayStat) {
    // If this day wasn't recorded, create a new entry for it.
    await analytics.hmset(date, {
      hits: 1,
      addresses: [requestStats.requestIP],
      uniqueVisitors: 1,
      countries: [requestStats.country],
      continents: [requestStats.continent],
      pages: [requestStats.page],
    });
  } else {
    let { updatedArray, didUpdate } = _updateArray(
      "addresses",
      requestStats.requestIP
    );
    let uniqueVisitors = storedDayStat.uniqueVisitors;
    // If the addresses vector did update, it means a new IP visited the site.
    if (didUpdate) uniqueVisitors++;

    await analytics.hmset(date, {
      hits: storedDayStat.hits + 1,
      addresses: updatedArray,
      uniqueVisitors: uniqueVisitors,
      countries: _updateArray("countries", requestStats.country).updatedArray,
      continents: _updateArray("continents", requestStats.continent)
        .updatedArray,
      pages: _updateArray("pages", requestStats.page).updatedArray,
    });
  }

  const storedStats = {
    pages: await analytics.zrange("pages", 0, -1, {
      withScores: true,
    }),
    countries: await analytics.zrange("countries", 0, -1, {
      withScores: true,
    }),
    continents: await analytics.zrange("continents", 0, -1, {
      withScores: true,
    }),
  };

  for (const stat in storedStats)
    if (storedStats[stat].length == 0) {
      if (stat === "countries")
        // countries => country!
        await analytics.zadd("countries", {
          score: 1,
          member: requestStats.country,
        });
      else
        await analytics.zadd(stat, {
          score: 1,
          // pages => page.
          member: requestStats[stat.substring(0, stat.length - 1)],
        });
    } else if (stat === "countries") {
      await analytics.zincrby("countries", 1, requestStats.country);
    } else
      await analytics.zincrby(
        stat,
        1,
        requestStats[stat.substring(0, stat.length - 1)]
      );
});

export default {
  async fetch(request, env) {
    return router.handle(env, request);
  },
};
