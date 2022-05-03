import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile, TILE_SELECTOR } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";

export const GRASS_COLORS = ["#0c0", "#0e0", "#0d0"];
export const GRASS_ELEMENT_NAME = "g-grass";

export class Grass extends Tile {
  constructor(biome: Biome, position: Position) {
    super(biome, position, "grass");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(GRASS_COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TILE_SELECTOR)
      .style.setProperty("--color", color);
  }
}

customElements.get(GRASS_ELEMENT_NAME) ??
  customElements.define(GRASS_ELEMENT_NAME, Grass);
