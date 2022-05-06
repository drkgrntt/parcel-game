type LogLevel = "debug" | "info" | "silent";
type LogData = any[];

interface LogDetail {
  data: LogData;
  level: LogLevel;
}

const LOG_EVENT = "g-log";
const LOG_LEVEL: LogLevel = "silent";

export const log = (...data: LogData) => {
  dispatchEvent(
    new CustomEvent<LogDetail>(LOG_EVENT, {
      detail: { data, level: LOG_LEVEL },
    })
  );
};

window.addEventListener(LOG_EVENT, (event: CustomEvent<LogDetail>) => {
  switch (event.detail.level) {
    case "debug":
      console.warn(...event.detail.data);
      break;
    case "info":
      console.log(...event.detail.data);
      break;
    case "silent":
    default:
      break;
  }
});
