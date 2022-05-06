import { Position } from "../../types";
import { Plant } from "../abstracts/Plant/Plant";
import {
  TREE_ELEMENT,
  TREE_GROWTH_RATE,
  TREE_SELECTOR,
} from "../../constants/tree";
import template from "./Tree.html";
import { MATURITY_LIMIT } from "../../constants/plant";

export class Tree extends Plant {
  constructor(position: Position, initialMaturity: number = 0) {
    super(position, TREE_GROWTH_RATE, initialMaturity);
    this.template = template;
  }

  get maturity(): number {
    return this._maturity;
  }

  set maturity(value: number) {
    this._maturity = value;
    const size = Math.floor((value / MATURITY_LIMIT) * 100);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TREE_SELECTOR)
      ?.style.setProperty("--maturity", size.toString());
  }
}

customElements.get(TREE_ELEMENT) ?? customElements.define(TREE_ELEMENT, Tree);
