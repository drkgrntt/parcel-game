import { BaseElement } from "../BaseElement";
import template from "./GamePawn.html";

export class GamePawn extends BaseElement {
  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    this.createEventListener("tile-selected", this.move.bind(this));
  }

  move(event: CustomEvent) {
    console.dir(event.detail);
    const pawn = this.shadowRoot.querySelector<HTMLDivElement>(".pawn");
    pawn?.style.setProperty("--x", event.detail.x);
    pawn?.style.setProperty("--y", event.detail.y);
  }
}

customElements.get("game-pawn") ?? customElements.define("game-pawn", GamePawn);
