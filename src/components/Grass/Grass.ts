import { getRandom } from "../../utils";
import { Tile } from "../Tile/Tile";

export class Grass extends Tile {
  static #COLORS = ["#0c0", "#0e0", "#0d0"];

  constructor(x: number, y: number) {
    super(x, y, "grass");
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

customElements.get("game-grass") ?? customElements.define("game-grass", Grass);
