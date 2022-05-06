import { Position } from "../../types";
import { Plant } from "../abstracts/Plant/Plant";
import {
  HARVEST_TREE_EVENT,
  TREE_ELEMENT,
  TREE_GROWTH_RATE,
  TREE_HARVEST_LIMIT,
  TREE_RESOURCES,
  TREE_SELECTOR,
} from "../../constants/tree";
import template from "./Tree.html";
import { MATURITY_LIMIT } from "../../constants/plant";
import { sendEvent } from "../../utils/events";
import { ITEM_SELECTED } from "../../constants/controls";
import { Pawn } from "../Pawn/Pawn";

export class Tree extends Plant {
  name = "Tree";
  actions = ["harvest"];

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

  harvest() {
    const handlePawn = (pawn: Pawn) => {
      const [x, y] = this.position;
      const isByTree = Object.values(pawn.tile.adjacentTiles).some(
        ({ position: [tx, ty] }) => tx === x && ty === y
      );
      if (!isByTree) return;

      const percentMature = this._maturity / MATURITY_LIMIT;
      const harvestedAmount = Math.floor(percentMature * TREE_HARVEST_LIMIT);

      if (!pawn.inventory[TREE_RESOURCES.WOOD]) {
        pawn.inventory[TREE_RESOURCES.WOOD] = 0;
      }
      pawn.inventory[TREE_RESOURCES.WOOD] += harvestedAmount;

      if (!pawn.inventory[TREE_RESOURCES.TREE_SEEDS]) {
        pawn.inventory[TREE_RESOURCES.TREE_SEEDS] = 0;
      }
      pawn.inventory[TREE_RESOURCES.TREE_SEEDS] += harvestedAmount;

      this.remove();
      sendEvent(ITEM_SELECTED);
    };
    sendEvent(HARVEST_TREE_EVENT, { item: this, callback: handlePawn });
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.createEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        sendEvent(ITEM_SELECTED, this);
      },
      this
    );
  }
}

customElements.get(TREE_ELEMENT) ?? customElements.define(TREE_ELEMENT, Tree);
