import { getRandomNumber } from "../../../utils";
import { MATURITY_LIMIT, PLANT_ELEMENT } from "../../../constants/plant";
import { GrowthRate, Position } from "../../../types";
import { BaseElement } from "../BaseElement/BaseElement";

export class Plant extends BaseElement {
  position: Position;
  growthRate: GrowthRate = 0;
  #maturity: number = 0;
  #creationTime: number;

  constructor(
    position: Position,
    growthRate: GrowthRate,
    initialMaturity: number = 0
  ) {
    super();
    this.position = position;
    this.growthRate = growthRate;
    this.maturity = initialMaturity;
  }

  get maturity(): number {
    return this.#maturity;
  }

  set maturity(value: number) {
    this.#maturity = value;
    // TODO: css stuff here
  }

  handleTimePassage(time: number): void {
    if (typeof this.#creationTime === "undefined") {
      this.#creationTime = time;
    } else if (this.#creationTime === time) {
      this.#grow();
    }
  }

  #grow(): void {
    if (this.maturity >= MATURITY_LIMIT) return;
    const number = getRandomNumber(this.growthRate);
    this.maturity += number;
  }
}

customElements.get(PLANT_ELEMENT) ??
  customElements.define(PLANT_ELEMENT, Plant);
