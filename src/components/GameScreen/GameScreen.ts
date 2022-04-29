import template from "./GameScreen.html";
import { BaseElement } from "../BaseElement";
import { GameText } from "../GameText/GameText";
import { GameTile } from "../GameTile/GameTile";

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus rutrum porttitor venenatis. Aenean volutpat dolor vitae lacus facilisis vestibulum. Duis tempus nec ex eu egestas. Mauris metus arcu, suscipit in lectus ac, blandit malesuada orci. Duis commodo tortor mi, pellentesque facilisis sem volutpat vel. Proin aliquam sem diam. Aenean at nunc tincidunt, pulvinar diam nec, porta tortor. Sed lacinia nec lorem et consequat. Morbi cursus id enim sed facilisis. Duis ac lectus sit amet metus consectetur ullamcorper. Integer lobortis ligula quis tortor vulputate convallis.
Donec viverra enim faucibus, condimentum est nec, semper enim. Mauris ut metus ante. Vivamus volutpat dolor ut quam tincidunt, quis venenatis leo cursus. Vivamus cursus nulla ac justo egestas, eu vehicula magna vehicula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam sed turpis ac leo convallis varius at ac libero. Vestibulum mollis nunc vitae gravida suscipit. Nulla quis volutpat erat. Cras interdum est felis, vel consequat leo facilisis ac. Ut neque lacus, semper eget arcu sit amet, dignissim eleifend sem. Maecenas hendrerit porttitor dolor ut porttitor. In et ipsum suscipit, euismod magna eu, efficitur est.
Nulla ac metus arcu. Proin blandit, velit non dictum dignissim, eros tellus dictum purus, vel facilisis turpis ex ac libero. Etiam tempus malesuada velit, a ultrices nisi fermentum ut. Nullam lorem erat, faucibus condimentum purus in, vehicula efficitur purus. Nunc venenatis turpis et dui finibus gravida. Aliquam a neque vulputate ante semper condimentum id eu ex. In hac habitasse platea dictumst. Phasellus iaculis ut lorem at pretium. Maecenas imperdiet nunc et tristique interdum. Vivamus tempus erat turpis, sit amet laoreet ante aliquet quis. Sed fermentum, tortor nec consectetur dignissim, arcu urna molestie augue, interdum lacinia justo urna id nunc. Morbi luctus maximus condimentum. Praesent eu vestibulum metus.
Donec sed magna neque. Nunc suscipit accumsan quam. Curabitur iaculis purus at augue dictum luctus. Sed nibh libero, venenatis a sagittis id, malesuada a lacus. Duis volutpat vestibulum arcu sit amet porta. Vestibulum pharetra nulla nec risus ullamcorper, ac tempus tortor pretium. Curabitur ultricies leo vel congue laoreet. Pellentesque sagittis blandit consequat. Pellentesque tincidunt lectus non porttitor pellentesque. Praesent pharetra, ex in pharetra euismod, neque quam ultrices justo, in eleifend diam nisi id nisi.
Pellentesque vitae porttitor velit. Nunc bibendum magna vel ante ultrices, a elementum urna euismod. Nullam non pulvinar nulla. Nunc in consequat risus. Etiam sollicitudin blandit aliquet. Curabitur diam erat, interdum in ullamcorper vel, hendrerit quis metus. Quisque at ante nibh. Quisque quam dolor, gravida in viverra eu, pharetra in tortor. Phasellus eget nulla nisl. Praesent id risus rutrum, tincidunt turpis porttitor, malesuada dolor. Duis rhoncus, lectus sit amet vehicula vulputate, ipsum lorem ornare felis, commodo condimentum dui odio in felis. Fusce eu nisl molestie, auctor nisl id, sodales diam. Aliquam dictum purus in gravida aliquam. Curabitur in nunc ut libero pharetra placerat. Pellentesque mattis sapien vel ex condimentum, sit amet vestibulum odio commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`;

export class GameScreen extends BaseElement {
  #height = 40;
  #width = 55;

  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    this.setTiles();
    const text = this.shadowRoot.querySelector<GameText>("game-text");
    text.text = loremIpsum;
  }

  setTiles(): void {
    const map = this.shadowRoot.querySelector(".map");
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        const tile = new GameTile(x, y);
        map.appendChild(tile);
      }
    }
  }
}

customElements.get("game-screen") ??
  customElements.define("game-screen", GameScreen);
