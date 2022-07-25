export const updateAllowedIPs = (bytecrowd, req) => {
  let allowedIPs = bytecrowd.allowedIPs;
  const IP = req.headers.get("CF-Connecting-IP");
  if (!allowedIPs.includes(IP)) allowedIPs.push(IP);

  return allowedIPs;
};

export const authByIP = (bytecrowd, req) => {
  if (
    bytecrowd.requiresAuth &&
    !bytecrowd.allowedIPs.includes(req.headers.get("CF-Connecting-IP"))
  )
    return false;
  return true;
};
