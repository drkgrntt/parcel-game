import { getRandomNumber } from "../../../utilities";
import { MATURITY_LIMIT, PLANT_ELEMENT } from "../../../constants/plant";
import { GrowthRate, Position } from "../../../types";
import { BaseElement } from "../BaseElement/BaseElement";

export class Plant extends BaseElement {
  position: Position;
  growthRate: GrowthRate = 0;
  protected _maturity: number = 0;
  #creationTime: number;

  constructor(
    position: Position,
    growthRate: GrowthRate,
    initialMaturity: number = 0
  ) {
    super();
    this.position = position;
    this.growthRate = growthRate;
    this._maturity = initialMaturity;
  }

  get maturity(): number {
    return this._maturity;
  }

  set maturity(value: number) {
    this._maturity = value;
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.maturity = this.maturity;
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
