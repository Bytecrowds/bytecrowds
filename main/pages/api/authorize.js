import redis from "../../database/redis";
import { failAuthorization } from "../../utils/authorization";
import success from "../../utils/approve";

export default async (req, res) => {
  const { name } = req.body;

  if (await redis.hget("bytecrowd:" + name, "authorizedEmails"))
    return failAuthorization("cannot update existing authorization", res);

  const authorizedEmails = req.body?.authorizedEmails;
  if (
    !authorizedEmails ||
    (authorizedEmails.length === 1 && authorizedEmails[0] === "")
  )
    return res.status(400).send("authorizedEmails cannot be empty");

  await redis.hset("bytecrowd:" + name, {
    authorizedEmails: authorizedEmails,
  });
  return success(res);
};
