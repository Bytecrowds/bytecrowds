const backend = process.env.NEXT_PUBLIC_BACKEND;

export const updateDB = (payload) => {
  fetch(backend + "/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const getBytecrowd = async (id, options, ip) => {
  let _res = await fetch(backend + "/bytecrowd/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Prevent sending the secret header from client when using password auth.
      "X-App-Key":
        options.authMethod === "IP" ? process.env.NEXT_PUBLIC_APP_KEY : "",
      "X-Forwarded-For": ip || null,
    },
    body: JSON.stringify(options),
  });
  const bytecrowd = await _res.json();
  return bytecrowd;
};
