import { syncedStore } from "@syncedstore/core";
import AblyProvider from "./ablyProvider";
import * as Ably from "ably";

// Setup a text field on the SyncedStore object.
const store = syncedStore({ bytecrowdText: "text" });
export default store;

export const setupAbly = async (id) => {
  const ablyClient = new Ably.Realtime.Promise({
    authUrl: "/api/ably",
    authMethod: "POST",
    authParams: {
      channel: id,
    },
  });
  const ablyProvider = new AblyProvider(ablyClient, id);
  await ablyProvider.initialize();
};
