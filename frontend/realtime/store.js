import { syncedStore } from "@syncedstore/core";
import AblyProvider from "./ablyProvider";
import * as Ably from "ably";

// Setup a text field on the SyncedStore object.
const store = syncedStore({ bytecrowdText: "text" });
export default store;

export const getAblyProvider = (id) => {
  const ablyClient = new Ably.Realtime({
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
    clientId: Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substring(0, 7),
  });

  const ablyProvider = new AblyProvider(ablyClient, id);

  return ablyProvider;
};
