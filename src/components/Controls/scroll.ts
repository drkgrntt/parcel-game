import { sendEvent } from "../../utilities/events";
import { Screen } from "../Screen/Screen";
import { ZOOM_IN_EVENT, ZOOM_OUT_EVENT } from "../../constants/controls";
import { GAME_READY_EVENT, SCREEN_SELECTOR } from "../../constants/screen";

const handleScroll = () => {
  const screen = document.querySelector<Screen>("g-screen");
  const controls = document.querySelector("g-controls");

  screen.createEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.deltaY > 0) {
        sendEvent(ZOOM_OUT_EVENT, event, controls);
      } else {
        sendEvent(ZOOM_IN_EVENT, event, controls);
      }
    },
    screen.shadowRoot.querySelector(SCREEN_SELECTOR)
  );
};

document.addEventListener(GAME_READY_EVENT, handleScroll, { once: true });
