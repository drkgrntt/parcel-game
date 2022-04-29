import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile } from "../../abstracts/Tile/Tile";

export class Dirt extends Tile {
  static #COLORS = ["#462e1a", "#503715", "#743e0c", "#552f12", "#46250a"];

  constructor(position: Position) {
    super(position, "dirt");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(Dirt.#COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(".tile")
      .style.setProperty("--color", color);
  }
}

customElements.get("game-dirt") ?? customElements.define("game-dirt", Dirt);
