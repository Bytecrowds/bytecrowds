import { Redis } from "@upstash/redis/cloudflare";

// Because cloudflare workers expose the env on fetch, we need to manually set the vars.
const analytics = new Redis({
  url: "UPSTASH_REST_URL",
  token: "UPSTASH_REST_TOKEN",
});

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // https://<ANALYTICS_URL>.com/<path>/<subpath>/... => <path>
    if (url.pathname.split("/")[1] !== "analytics")
      return new Response("unauthorized(try /analytics/...) ", { status: 401 });

    const page = url.searchParams.get("page");
    if (!page)
      return new Response("page query parameter is missing", { status: 400 });

    const _updateDayStatArray = (name, stat) => {
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
      // https://<ANALYTICS_URL>.com/analytics/page?=<page> => page
      page: url.searchParams.get("page"),
      country: req.cf.country,
      continent: req.cf.continent,
      // Hash the IP address.
      requestIP: Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(req.headers.get("CF-Connecting-IP"))
          )
        )
      )
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    };

    const _date = new Date();
    const date =
      // In javascript months range from 0 to 11 so we need to increment by 1 to get the real value.
      _date.getFullYear() +
      " " +
      (_date.getMonth() + 1) +
      " " +
      _date.getDate();

    const storedDayStat = await analytics.hgetall(date);
    if (!storedDayStat) {
      // If this day wasn't recorded, create a new entry for it.
      await analytics.hset(date, {
        hits: 1,
        addresses: [requestStats.requestIP],
        uniqueVisitors: 1,
        countries: [requestStats.country],
        continents: [requestStats.continent],
        pages: [requestStats.page],
      });
    } else {
      let { updatedArray, didUpdate } = _updateDayStatArray(
        "addresses",
        requestStats.requestIP
      );
      let uniqueVisitors = storedDayStat.uniqueVisitors;
      // If the addresses vector did update, it means a new IP visited the site.
      if (didUpdate) uniqueVisitors++;

      await analytics.hset(date, {
        hits: storedDayStat.hits + 1,
        addresses: updatedArray,
        uniqueVisitors: uniqueVisitors,
        countries: _updateDayStatArray("countries", requestStats.country)
          .updatedArray,
        continents: _updateDayStatArray("continents", requestStats.continent)
          .updatedArray,
        pages: _updateDayStatArray("pages", requestStats.page).updatedArray,
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
          // countries => country
          await analytics.zadd("countries", {
            score: 1,
            member: requestStats.country,
          });
        else {
          console.log(stat, requestStats[stat.substring(0, stat.length - 1)]);
          await analytics.zadd(stat, {
            score: 1,
            // pages => page
            member: requestStats[stat.substring(0, stat.length - 1)],
          });
        }
      } else if (stat === "countries") {
        await analytics.zincrby("countries", 1, requestStats.country);
      } else
        await analytics.zincrby(
          stat,
          1,
          requestStats[stat.substring(0, stat.length - 1)]
        );
    return new Response("ok");
  },
};
