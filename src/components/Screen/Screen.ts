import template from "./Screen.html";
import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import { Text } from "../Text/Text";
import { WELCOME } from "../../utils/texts";
import { Map } from "../Map/Map";
import { Player } from "../Player/Player";
import { getRandom } from "../../utils";

export class Screen extends BaseElement {
  // Visible area
  #height = 40;
  #width = 60;

  constructor() {
    super();
    this.template = template;
  }
  set height(value: number) {
    this.#height = value;
    const screen = this.shadowRoot.querySelector<HTMLDivElement>(".screen");
    screen?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const screen = this.shadowRoot.querySelector<HTMLDivElement>(".screen");
    screen?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;

    const text = this.shadowRoot.querySelector<Text>("g-text");
    text.text = WELCOME;

    this.#setPlayer();
  }

  #setPlayer(): void {
    const map = this.shadowRoot.querySelector<Map>("g-map");
    this.createEventListener(
      "biomes-set",
      () => {
        // TODO: This should be based on passibility
        const biome = getRandom(map.biomes, (biome) => biome.type !== "water");
        this.createEventListener(
          "tiles-set",
          () => {
            const tile = getRandom(biome.tiles);
            const player = new Player(tile);
            map.appendChild(player);
          },
          biome
        );
      },
      map
    );
  }
}

customElements.get("g-screen") ?? customElements.define("g-screen", Screen);
