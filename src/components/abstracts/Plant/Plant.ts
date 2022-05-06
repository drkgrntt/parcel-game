import { getRandomNumber } from "../../../utilities";
import { MATURITY_LIMIT, PLANT_ELEMENT } from "../../../constants/plant";
import { GrowthRate, Position } from "../../../types";
import { BaseElement } from "../BaseElement/BaseElement";
import { Tile } from "../Tile/Tile";

export class Plant extends BaseElement {
  tile: Tile;
  position: Position;
  growthRate: GrowthRate = 0;
  protected _maturity: number = 0;
  protected _selected: boolean = false;
  #creationTime: number;

  constructor(tile: Tile, growthRate: GrowthRate, initialMaturity: number = 0) {
    super();
    this.position = tile.position;
    this.growthRate = growthRate;
    this._maturity = initialMaturity;
    this.tile = tile;
    tile.holding.push(this);
  }

  get maturity(): number {
    return this._maturity;
  }

  set maturity(value: number) {
    this._maturity = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.maturity = this._maturity;
  }

  handleTimePassage(time: number): void {
    if (typeof this.#creationTime === "undefined") {
      this.#creationTime = time;
    } else if (this.#creationTime === time) {
      this.#grow();
    }
  }

  #grow(): void {
    console.log(this._maturity, MATURITY_LIMIT);
    if (this._maturity >= MATURITY_LIMIT) return;
    const number = getRandomNumber(this.growthRate);
    this.maturity = this._maturity + number;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const plantIndex = this.tile.holding.findIndex((item) => item === this);
    this.tile.holding.splice(plantIndex, 1);
  }
}

customElements.get(PLANT_ELEMENT) ??
  customElements.define(PLANT_ELEMENT, Plant);
