import { Pawn } from "../Pawn/Pawn";

export class Player extends Pawn {
  templateSetCallback(): void {
    super.templateSetCallback();
    this.createEventListener(
      "tile-selected",
      this.handleTileSelection.bind(this)
    );
  }
}

customElements.get("game-player") ??
  customElements.define("game-player", Player);