import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile } from "../../abstracts/Tile/Tile";
import { Biome } from "../../abstracts/Biome/Biome";

export class Water extends Tile {
  static #COLORS = ["#00f", "#03d", "#30d"];

  constructor(biome: Biome, position: Position) {
    super(biome, position, "water");
    this.isPassable = false;
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(Water.#COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(".tile")
      .style.setProperty("--color", color);
  }
}

customElements.get("g-water") ?? customElements.define("g-water", Water);
