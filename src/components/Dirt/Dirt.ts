import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile } from "../../abstracts/Tile/Tile";
import { Biome } from "../../abstracts/Biome/Biome";

export class Dirt extends Tile {
  static #COLORS = ["#462e1a", "#503715", "#743e0c", "#552f12", "#46250a"];

  constructor(biome: Biome, position: Position) {
    super(biome, position, "dirt");
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

customElements.get("g-dirt") ?? customElements.define("g-dirt", Dirt);
