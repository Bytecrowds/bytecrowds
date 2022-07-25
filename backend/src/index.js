import Router from "@tsndr/cloudflare-worker-router";
import { Redis } from "@upstash/redis/cloudflare";
import { updateAllowedIPs, authByIP } from "./utils";
const qr = require("qr-image");

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

router.post("/bytecrowd/:bytecrowd", async ({ env, req, res }) => {
  const key = req.headers.get("X-App-Key");
  if (key !== env.APP_KEY) {
    res.status = 401;
    return;
  }

  const name = req.params.bytecrowd;
  const authMethod = req.body.authMethod;

  let bytecrowd = await bytecrowds.hgetall(name);

  if (!bytecrowd) {
    res.body = {};
    return;
  }

  if (bytecrowd.requiresAuth) {
    if (authMethod === "IP") {
      if (!authByIP(bytecrowd, req)) {
        bytecrowd["authFailed"] = true;
        res.body = bytecrowd;
        return;
      }
    } else {
      // Auth by password.
      const password = req.body.password;
      if ((await env.BYTECROWDS.get(name)) !== password) {
        res.body = { authFailed: true };
        return;
      }
      const allowedIPs = updateAllowedIPs(bytecrowd, req);
      await bytecrowds.hmset(name, {
        allowedIPs: allowedIPs,
      });
    }
  }
  res.body = bytecrowd;
});

// Create or reset password.
router.get("/auth/:bytecrowd", async ({ env, req, res }) => {
  const name = req.params.bytecrowd;
  const bytecrowd = await bytecrowds.hgetall(name);

  if (!authByIP(bytecrowd, req)) {
    res.status = 401;
    return;
  }

  // Generate password.
  let password = "";
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const random = new Uint32Array(chars.length);
  crypto.getRandomValues(random);
  for (let i = 0; i <= 20; i++) password += chars[random[i] % chars.length];

  // Add the password to the KV bindings(encryption is used by default).
  await env.BYTECROWDS.put(name, password);

  const allowedIPs = updateAllowedIPs(bytecrowd, req);
  await bytecrowds.hmset(name, {
    allowedIPs: allowedIPs,
    requiresAuth: true,
  });

  const qrCode = qr.imageSync(password);
  res.body = qrCode.toString("base64");
});

router.post("/update", async ({ req, res }) => {
  const name = req.body.name;
  let data = {
    text: req.body.text,
    language: req.body.language,
  };

  const storedBytecrowd = await bytecrowds.hgetall(name);

  // Only check IP because this route should be called only when updating from the app.
  if (!authByIP(bytecrowds, req)) {
    res.status = 401;
    return;
  }

  if (!storedBytecrowd)
    // If the bytecrowd doesn't exist, create it.
    await bytecrowds.hmset(name, {
      text: data.text,
      language: "javascript",
      requiresAuth: false,
      allowedIPs: [],
    });
  else {
    // Remove the authorization fields from comparison once authenticated.
    delete storedBytecrowd.allowedIPs, storedBytecrowd.requiresAuth;
    if (
      // If at least one element changed, update the bytecrowd.
      JSON.stringify(storedBytecrowd) != JSON.stringify(data)
    ) {
      // If the request doesn't contain a new value for a field, use the current one.
      for (let field in data)
        if (!data[field]) data[field] = storedBytecrowd[field];

      await bytecrowds.hmset(name, {
        text: data.text,
        language: data.language,
      });
    }
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
