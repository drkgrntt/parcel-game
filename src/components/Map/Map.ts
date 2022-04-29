import template from "./Map.html";
import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import { Grass } from "../Grass/Grass";
import { Tile } from "../../abstracts/Tile/Tile";
import { Dirt } from "../Dirt/Dirt";
import { getRandom } from "../../utils";

const tilesTypes: typeof Tile[] = [Grass, Dirt];

export class Map extends BaseElement {
  // Full map size, this can be bigger than the visible area
  #height = 40;
  #width = 55;
  #tiles: Tile[] = [];

  constructor() {
    super();
    this.template = template;
  }

  set height(value: number) {
    this.#height = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(".map");
    map?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(".map");
    map?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.setTiles();
  }

  setTiles(): void {
    const map = this.shadowRoot.querySelector(".map");
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        const TileType = getRandom(tilesTypes);
        const tile = new TileType([x, y], undefined);
        this.#tiles.push(tile);
        map.appendChild(tile);
      }
    }
  }
}

customElements.get("game-map") ?? customElements.define("game-map", Map);
