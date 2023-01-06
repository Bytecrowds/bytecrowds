export const updateAllowedIPs = (bytecrowd, req) => {
  let allowedIPs = bytecrowd.allowedIPs;
  const IP = req.headers.get("CF-Connecting-IP");
  if (!allowedIPs.includes(IP)) allowedIPs.push(IP);

  return allowedIPs;
};

export const authByIP = (bytecrowd, req) => {
  if (
    bytecrowd.requiresAuth &&
    !bytecrowd.allowedIPs.includes(req.headers.get("CF-Connecting-IP")) &&
    // We will treat the vercel function that handles frontend's SSR as a proxy
    !bytecrowd.allowedIPs.includes(req.headers.get("X-Forwared-For"))
  )
    return false;
  return true;
};
