import { getYjsValue } from "@syncedstore/core";
import * as Y from "yjs";
import store from "./store";

export default class AblyProvider {
  constructor(client, channel) {
    this.client = client;
    this.channel = client.channels.get(channel);
    this.doc = getYjsValue(store);
    this.clientId = this.doc.clientID.toString();

    this.channel.subscribe(this.handleMessage.bind(this));
    this.channel.presence.enter();

    this.doc.on("update", this.handleUpdate.bind(this));

    const state = Y.encodeStateVector(this.doc);
    this.channel.publish("syncStep1", state);
  }

  handleMessage(msg) {
    if (msg.clientId === this.clientId) return;

    switch (msg.name) {
      case "syncStep1":
        const reply = Y.encodeStateAsUpdate(this.doc, new Uint8Array(msg.data));
        this.channel.publish("syncStep2", reply);
        break;
      case "syncStep2":
        Y.applyUpdate(this.doc, new Uint8Array(msg.data), this);
        break;
      case "update":
        Y.applyUpdate(this.doc, new Uint8Array(msg.data), this);
        break;
      default:
        console.error(`Unexpected message: ${msg.name}`);
        break;
    }
  }

  handleUpdate(update, origin) {
    if (origin !== this) {
      this.channel.publish("update", update);
    }
  }
}
