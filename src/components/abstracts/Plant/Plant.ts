import { PLANT_ELEMENT } from "../../../constants/plant";
import { Position } from "../../../types";
import { BaseElement } from "../BaseElement/BaseElement";
import template from "./Plant.html";

export class Plant extends BaseElement {
  position: Position;

  constructor(position: Position) {
    super();
    this.template = template;
    this.position = position;
  }

  templateSetCallback(): void {}
}

customElements.get(PLANT_ELEMENT) ??
  customElements.define(PLANT_ELEMENT, Plant);
