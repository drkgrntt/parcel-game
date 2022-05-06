import { capitalizeFirstLetter } from "../../utilities";
import {
  AFTER_ZOOM_EVENT,
  BEFORE_ZOOM_EVENT,
  CONTROLS_ELEMENT,
  ITEM_SELECTED,
  SCALES,
  SELECTED_CONTAINER_SELECTOR,
  TIME_SELECTOR,
  ZOOM_IN_EVENT,
  ZOOM_IN_SELECTOR,
  ZOOM_OUT_EVENT,
  ZOOM_OUT_SELECTOR,
} from "../../constants/controls";
import { SCREEN_ELEMENT_NAME, SCREEN_SELECTOR } from "../../constants/screen";
import { sendEvent } from "../../utilities/events";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Screen } from "../Screen/Screen";
import template from "./Controls.html";
import "./drag";
import "./scroll";

export class Controls extends BaseElement {
  #scaleIndex = SCALES.indexOf(1);
  #selected;

  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.#addButtonControls();
    this.#addScrollListener();
    this.#addSelectedListener();
  }

  get scale() {
    return SCALES[this.#scaleIndex];
  }

  set selected(value) {
    this.#selected = value;
    const container = this.shadowRoot.querySelector<HTMLDivElement>(
      SELECTED_CONTAINER_SELECTOR
    );
    container.innerHTML = "";

    if (!this.#selected) return;

    const name = document.createElement("p");
    name.textContent = this.#selected.name;
    container.appendChild(name);

    this.#selected.properties.forEach((property: string) => {
      const p = document.createElement("p");
      p.textContent = `${capitalizeFirstLetter(property)}: ${
        this.#selected[property]
      }`;
      container.appendChild(p);
    });

    this.#selected.actions.forEach((action: string) => {
      const button = document.createElement("button");
      button.textContent = capitalizeFirstLetter(action);
      button.onclick = this.#selected[action].bind(this.#selected);
      container.appendChild(button);
    });
  }

  #addSelectedListener() {
    this.createEventListener(ITEM_SELECTED, (event: CustomEvent) => {
      this.selected = event.detail;
    });
  }

  handleTimePassage(time: number): void {
    this.shadowRoot
      .querySelector<HTMLParagraphElement>(TIME_SELECTOR)
      .querySelector("span").innerText = time.toString();
  }

  #addScrollListener() {
    this.createEventListener(ZOOM_IN_EVENT, this.#zoomIn.bind(this), this);
    this.createEventListener(ZOOM_OUT_EVENT, this.#zoomOut.bind(this), this);
  }

  #addButtonControls() {
    this.createEventListener(
      "click",
      () => sendEvent(ZOOM_IN_EVENT, null, this),
      this.shadowRoot.querySelector(ZOOM_IN_SELECTOR)
    );

    this.createEventListener(
      "click",
      () => sendEvent(ZOOM_OUT_EVENT, null, this),
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
