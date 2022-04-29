type LogLevel = "debug" | "info";
type LogData = any[];

interface LogDetail {
  data: LogData;
  level: LogLevel;
}

const LOG_EVENT = "game-log";

export const log = (...data: LogData) => {
  dispatchEvent(
    new CustomEvent<LogDetail>(LOG_EVENT, { detail: { data, level: "debug" } })
  );
};

window.addEventListener(LOG_EVENT, (event: CustomEvent<LogDetail>) => {
  switch (event.detail.level) {
    case "debug":
      console.log(...event.detail.data);
      break;
    default:
      break;
  }
});
