import template from "./Map.html";
import { BaseElement } from "../BaseElement";
import { Grass } from "../Grass/Grass";
import { Tile } from "../Tile/Tile";

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
        const tile = new Grass([x, y]);
        this.#tiles.push(tile);
        map.appendChild(tile);
      }
    }
  }
}

customElements.get("game-map") ?? customElements.define("game-map", Map);
