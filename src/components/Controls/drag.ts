import {
  GAME_READY_EVENT,
  SCREEN_ELEMENT_NAME,
  SCREEN_SELECTOR,
} from "../../constants/screen";

const handleDrag = () => {
  const SCALE_X = 1.5;
  const SCALE_Y = 1.5;

  const BUTTON = 2;
  const CTRL_KEY = false;
  const ALT_KEY = false;
  const SHIFT_KEY = false;
  const META_KEY = false;

  const AUXCLICK = false;

  let el, clientX, clientY;

  let validEvent = (e) =>
    e.which === BUTTON &&
    e.ctrlKey === CTRL_KEY &&
    e.altKey === ALT_KEY &&
    e.shiftKey === SHIFT_KEY &&
    e.metaKey === META_KEY;

  let mousemove = (e) => {
    swallow(e);

    el.scrollBy(
      SCALE_X * (clientX - e.clientX),
      SCALE_Y * (clientY - e.clientY)
    );
    clientX = e.clientX;
    clientY = e.clientY;
  };

  let swallow = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  let finish = (e) => {
    swallow(e);

    document.removeEventListener("mousemove", mousemove, true);
    document.removeEventListener("mouseover", swallow, true);
    document.removeEventListener("mouseenter", swallow, true);
    document.removeEventListener("mouseup", finish, true);
  };

  if (!AUXCLICK) {
    document.addEventListener("auxclick", (e) => {
      if (!validEvent(e)) {
        return;
      }

      swallow(e);
    });
  }

  const screen = document.querySelector(SCREEN_ELEMENT_NAME);

  screen.addEventListener(
    "mousedown",
    (e: MouseEvent) => {
      if (!validEvent(e)) {
        return;
      }

      swallow(e);

      el = screen.shadowRoot.querySelector(SCREEN_SELECTOR);
      clientX = e.clientX;
      clientY = e.clientY;

      document.addEventListener("mousemove", mousemove, true);
      document.addEventListener("mouseover", swallow, true);
      document.addEventListener("mouseenter", swallow, true);
      document.addEventListener("mouseup", finish, true);
    },
    true
  );
};

document.addEventListener(GAME_READY_EVENT, handleDrag, { once: true });
