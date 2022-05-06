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
import { sendEvent } from "../../utilities/events";
import { ITEM_SELECTED } from "../../constants/controls";
import { Pawn } from "../Pawn/Pawn";
import { Tile } from "../abstracts/Tile/Tile";
import { NEW_TEXT_EVENT } from "../../constants/text";

export class Tree extends Plant {
  name = "Tree";
  properties = ["maturity"];
  actions = ["harvest"];

  constructor(tile: Tile, initialMaturity: number = 0) {
    super(tile, TREE_GROWTH_RATE, initialMaturity);
    this.template = template;
    tile.isPassable = false;
  }

  get maturity(): number {
    return Math.floor((this._maturity / MATURITY_LIMIT) * 100);
  }

  set maturity(value: number) {
    this._maturity = value;
    const size = Math.floor((value / MATURITY_LIMIT) * 100);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TREE_SELECTOR)
      ?.style.setProperty("--maturity", size.toString());
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    const selectedVar = this._selected ? "--selected" : "--unselected";
    this.shadowRoot
      .querySelector<HTMLDivElement>(TREE_SELECTOR)
      ?.style.setProperty("--box-shadow", `var(${selectedVar})`);
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

      sendEvent(
        NEW_TEXT_EVENT,
        `You have acquired ${harvestedAmount} wood and tree seeds.`
      );

      this.remove();
      if (this._selected) sendEvent(ITEM_SELECTED);
    };
    sendEvent(HARVEST_TREE_EVENT, { item: this, callback: handlePawn });
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.#handleSelect();
  }

  #handleSelect() {
    this.createEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        sendEvent(ITEM_SELECTED, this);
      },
      this
    );

    this.createEventListener(ITEM_SELECTED, (event: CustomEvent<Tree>) => {
      if (event.detail === this) {
        this.selected = true;
      } else if (this._selected) {
        this.selected = false;
      }
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.tile.isPassable = true;
  }
}

customElements.get(TREE_ELEMENT) ?? customElements.define(TREE_ELEMENT, Tree);
