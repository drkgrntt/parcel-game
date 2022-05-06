import { TIME_CHANGE_EVENT } from "../../../constants/map";
import { TEMPLATE_SET_EVENT } from "../../../constants/baseElement";
import { sendEvent } from "../../../utilities/events";
import { getTemplate } from "../../../utilities/templates";

export abstract class BaseElement extends HTMLElement {
  name = "Element";
  actions = [];

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

  templateSetCallback(): void {
    this.createEventListener(
      TIME_CHANGE_EVENT,
      (event: CustomEvent<{ time: number }>) => {
        this.handleTimePassage(event.detail.time);
      }
    );
  }

  handleTimePassage(time: number): void {}

  disconnectedCallback() {
    this.destroy();
  }

  destroy() {
    for (const [object, event, cb] of this.#eventListeners) {
      object?.removeEventListener(event, cb);
    }
  }
}
