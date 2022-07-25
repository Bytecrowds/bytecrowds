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

export const getBytecrowd = async (id, options) => {
  let _res = await fetch(backend + "/bytecrowd/" + id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Key": process.env.NEXT_PUBLIC_APP_KEY,
    },
    body: JSON.stringify(options),
  });
  const bytecrowd = await _res.json();
  return bytecrowd;
};
