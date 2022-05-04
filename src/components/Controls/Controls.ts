import {
  AFTER_ZOOM_EVENT,
  BEFORE_ZOOM_EVENT,
  CONTROLS_ELEMENT,
  SCALES,
  ZOOM_IN_EVENT,
  ZOOM_IN_SELECTOR,
  ZOOM_OUT_EVENT,
  ZOOM_OUT_SELECTOR,
} from "../../constants/controls";
import { SCREEN_ELEMENT_NAME, SCREEN_SELECTOR } from "../../constants/screen";
import { sendEvent } from "../../utils/events";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Screen } from "../Screen/Screen";
import template from "./Controls.html";
import "./drag";
import "./scroll";

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
