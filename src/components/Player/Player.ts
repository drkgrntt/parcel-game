import { PLAYER_ELEMENT_NAME } from "../../constants/player";
import { TILE_SELECTED_EVENT } from "../../constants/tile";
import { Pawn } from "../Pawn/Pawn";

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
