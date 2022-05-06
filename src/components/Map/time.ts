import { STARTING_TIME, TIME_CHANGE_EVENT } from "../../constants/map";
import { sendEvent } from "../../utilities/events";
import { GAME_READY_EVENT } from "../../constants/screen";

let interval: number;
let hour = STARTING_TIME;

const handleTime = () => {
  sendEvent(TIME_CHANGE_EVENT, { time: hour });
  interval = setInterval(() => {
    hour++;
    if (hour === 24) hour = 0;
    sendEvent(TIME_CHANGE_EVENT, { time: hour });
  }, 1000 * 30);
};

document.addEventListener(GAME_READY_EVENT, handleTime, { once: true });
