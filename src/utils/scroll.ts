import { Screen } from "../components/Screen/Screen";
import { sendEvent } from "./events";

const handleScroll = () => {
  const screen = document.querySelector<Screen>("g-screen");
  const controls = document.querySelector("g-controls");

  screen.createEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.deltaY > 0) {
        sendEvent("zoom-out", null, controls);
      } else {
        sendEvent("zoom-in", null, controls);
      }
    },
    screen.shadowRoot.querySelector(".screen")
  );
};

document.addEventListener("game-ready", handleScroll, { once: true });
