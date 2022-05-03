import { TILE_SELECTED_EVENT } from "../abstracts/Tile/Tile";
import { Pawn } from "../Pawn/Pawn";

export const PLAYER_ELEMENT_NAME = "g-player";

export class Player extends Pawn {
  templateSetCallback(): void {
    super.templateSetCallback();
    this.createEventListener(
      TILE_SELECTED_EVENT,
      this.handleTileSelection.bind(this)
    );
  }
}

customElements.get(PLAYER_ELEMENT_NAME) ??
  customElements.define(PLAYER_ELEMENT_NAME, Player);
