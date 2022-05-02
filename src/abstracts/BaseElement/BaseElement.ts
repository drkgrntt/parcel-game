import { sendEvent } from "../../utils/events";
import { getTemplate } from "../../utils/templates";

export const TEMPLATE_SET_EVENT = "template-set";

export abstract class BaseElement extends HTMLElement {
  #template: HTMLTemplateElement;
  #eventListeners: [object: any, event: string, cb: (event: Event) => void][] =
    [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.addEventListener(
      TEMPLATE_SET_EVENT,
      this.templateSetCallback.bind(this),
      {
        once: true,
      }
    );
  }

  createEventListener<EventType extends Event>(
    event: string,
    cb: (event: EventType) => void,
    object: any = document
  ): void {
    if (!object) {
      return;
    }
    object.addEventListener(event, cb);
    this.#eventListeners.push([object, event, cb]);
  }

  get template() {
    return this.#template.innerHTML;
  }

  set template(value: string) {
    getTemplate(value).then((html) => {
      this.#template = document.createElement("template");
      this.#template.innerHTML = html;
      this.shadowRoot.appendChild(this.#template.content.cloneNode(true));
      setTimeout(() => sendEvent(TEMPLATE_SET_EVENT, this, this));
    });
  }

  templateSetCallback(): void {}

  disonnectedCallback() {
    this.destroy();
  }

  destroy() {
    for (const [object, event, cb] of this.#eventListeners) {
      object?.removeEventListener(event, cb);
    }
  }
}
