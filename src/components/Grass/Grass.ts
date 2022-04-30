import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile } from "../../abstracts/Tile/Tile";
import { Biome } from "../../abstracts/Biome/Biome";

export class Grass extends Tile {
  static #COLORS = ["#0c0", "#0e0", "#0d0"];

  constructor(biome: Biome, position: Position) {
    super(biome, position, "grass");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(Grass.#COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(".tile")
      .style.setProperty("--color", color);
  }
}

customElements.get("g-grass") ?? customElements.define("g-grass", Grass);
