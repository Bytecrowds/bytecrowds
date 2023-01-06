export default function isAuthorized(authorizedEmails, session) {
  return !authorizedEmails || authorizedEmails.includes(session.user.email);
}

export const failAuthorization = (reason, res) => {
  let message = ["login", "authorization"].includes(reason)
    ? process.env.AUTHORIZATION_FAILED_MESSAGE.replace("<reason>", reason)
    : reason;

  res.status(401).send(message);
};

export const authorize = async (id, emails) => {
  return await fetch("/api/authorize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: id,
      authorizedEmails: emails,
    }),
  });
};
