const { createLogger, format, transports } = require("winston");
const { printf, combine, ms } = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const { frFullDate } = require("../helpers/HDate");

const tError = new DailyRotateFile({
  level: "error",
  filename: `./src/storage/logs/node-%DATE%.log`,
  zippedArchive: true,
  maxFiles: "14d",
  handleExceptions: true,
  handleRejections: true,
});

const logFormat = printf(({ level, label, message, ms }) => {
  return `[${frFullDate()}] ${level.toUpperCase()}: ${label} => ${message} (${ms})`;
});

const logger = createLogger({
  format: combine(ms(), logFormat),
  transports: [new transports.Console(), tError],
});

module.exports = {
  logger,
};
