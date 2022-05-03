import { sendEvent } from "../../utils/events";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import template from "./Controls.html";

export const ZOOM_IN_SELECTOR = ".zoom.in";
export const ZOOM_OUT_SELECTOR = ".zoom.out";
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
    this.createEventListener("zoom-in", this.#zoomIn.bind(this), this);
    this.createEventListener("zoom-out", this.#zoomOut.bind(this), this);
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

  #zoomIn(event: MouseEvent) {
    if (this.#scaleIndex >= SCALES.length - 1) return;
    sendEvent("before-zoom");
    this.#scaleIndex++;
    document.documentElement.style.setProperty(
      "--scale",
      SCALES[this.#scaleIndex].toString()
    );
    sendEvent("after-zoom");
  }

  #zoomOut(event: MouseEvent) {
    if (this.#scaleIndex <= 0) return;
    sendEvent("before-zoom");
    this.#scaleIndex--;
    document.documentElement.style.setProperty(
      "--scale",
      SCALES[this.#scaleIndex].toString()
    );
    sendEvent("after-zoom");
  }
}

customElements.get(CONTROLS_ELEMENT) ??
  customElements.define(CONTROLS_ELEMENT, Controls);
