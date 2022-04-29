export const sendEvent = (name: string, data: any, object: any = document) => {
  const event = new CustomEvent(name, { detail: data });
  object.dispatchEvent(event);
};
