import { log } from "./logger";

export const sendEvent = (name: string, data?: any, object: any = document) => {
  log("event:", { name, data, object });
  const event = new CustomEvent(name, { detail: data });
  object.dispatchEvent(event);
};
