import { Position } from "../../types";
import { getRandom } from "../../utilities";
import { Tile } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";
import { TILE_SELECTOR } from "../../constants/tile";
import { DIRT_COLORS, DIRT_ELEMENT_NAME } from "../../constants/dirt";

export class Dirt extends Tile {
  constructor(biome: Biome, position: Position) {
    super(biome, position, "dirt");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(DIRT_COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TILE_SELECTOR)
      .style.setProperty("--color", color);
  }
}

customElements.get(DIRT_ELEMENT_NAME) ??
  customElements.define(DIRT_ELEMENT_NAME, Dirt);
