import { Position } from "../../types";
import { Plant } from "../abstracts/Plant/Plant";
import { TREE_ELEMENT, TREE_GROWTH_RATE } from "../../constants/tree";
import template from "./Tree.html";

export class Tree extends Plant {
  constructor(position: Position, initialMaturity: number = 0) {
    super(position, TREE_GROWTH_RATE, initialMaturity);
    this.template = template;
  }
}

customElements.get(TREE_ELEMENT) ?? customElements.define(TREE_ELEMENT, Tree);
