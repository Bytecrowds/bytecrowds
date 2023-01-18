import redis from "../../database/redis";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import isAuthorized, { failAuthorization } from "../../utils/authorization";
import success from "../../utils/approve";

const Ably = require("ably");

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const { channel } = req.body;

  const authorizedEmails = await redis.hget(
    "bytecrowd:" + channel,
    "authorizedEmails"
  );

  if (!isAuthorized(authorizedEmails, session))
    return failAuthorization("authorization", res);

  const ablyClient = new Ably.Rest({
    key: process.env.ABLY_API_KEY,
  });

  let authorizationOptions = {};
  authorizationOptions[channel] = ["subscribe", "publish", "presence"];

  ablyClient.auth.createTokenRequest(
    {
      clientId: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substring(0, 7),
      capability: JSON.stringify(authorizationOptions),
    },
    null,
    (err, tokenRequest) => {
      return success(res, tokenRequest);
    }
  );
};
