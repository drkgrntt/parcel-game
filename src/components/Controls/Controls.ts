import { sendEvent } from "../../utils/events";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Screen, SCREEN_ELEMENT_NAME, SCREEN_SELECTOR } from "../Screen/Screen";
import template from "./Controls.html";
import "./drag";
import "./scroll";

export const ZOOM_IN_SELECTOR = ".zoom.in";
export const ZOOM_OUT_SELECTOR = ".zoom.out";
export const ZOOM_IN_EVENT = "zoom-in";
export const ZOOM_OUT_EVENT = "zoom-out";
export const BEFORE_ZOOM_EVENT = "before-zoom";
export const AFTER_ZOOM_EVENT = "after-zoom";
export const SCALES = [0.4, 0.6, 0.8, 1, 1.5, 2, 3, 4];
export const CONTROLS_ELEMENT = "g-controls";

class Controls extends BaseElement {
  #scaleIndex = SCALES.indexOf(1);

  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    this.#addButtonControls();
    this.#addScrollListener();
  }

  #addScrollListener() {
    this.createEventListener(ZOOM_IN_EVENT, this.#zoomIn.bind(this), this);
    this.createEventListener(ZOOM_OUT_EVENT, this.#zoomOut.bind(this), this);
  }

  #addButtonControls() {
    this.createEventListener(
      "click",
      this.#zoomIn.bind(this),
      this.shadowRoot.querySelector(ZOOM_IN_SELECTOR)
    );

    this.createEventListener(
      "click",
      this.#zoomOut.bind(this),
      this.shadowRoot.querySelector(ZOOM_OUT_SELECTOR)
    );
  }

  #zoomIn(event: CustomEvent<WheelEvent>) {
    if (this.#scaleIndex >= SCALES.length - 1) return;

    sendEvent(BEFORE_ZOOM_EVENT);
    this.#scaleIndex++;
    document.documentElement.style.setProperty(
      "--scale",
      SCALES[this.#scaleIndex].toString()
    );

    if (event.detail) {
      const screen = document.querySelector<Screen>(SCREEN_ELEMENT_NAME);
      screen.shadowRoot.querySelector(SCREEN_SELECTOR).scrollTo({
        left: event.detail.clientX * (SCALES[this.#scaleIndex] / 2),
        top: event.detail.clientY * (SCALES[this.#scaleIndex] / 2),
      });
    }

    sendEvent(AFTER_ZOOM_EVENT);
  }

  #zoomOut(event: CustomEvent<WheelEvent>) {
    if (this.#scaleIndex <= 0) return;
    sendEvent(BEFORE_ZOOM_EVENT);
    this.#scaleIndex--;
    document.documentElement.style.setProperty(
      "--scale",
      SCALES[this.#scaleIndex].toString()
    );
    sendEvent(AFTER_ZOOM_EVENT);
  }
}

customElements.get(CONTROLS_ELEMENT) ??
  customElements.define(CONTROLS_ELEMENT, Controls);
