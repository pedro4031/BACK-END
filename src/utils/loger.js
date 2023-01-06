const { createLogger, transports, format } = require("winston");
const { combine, timestamp, colorize, printf, label } = format;

const customFormat = printf(({ label, level, message, timestamp }) => {
	return `${label} [ ${timestamp} ] ${level}: ${message} `;
});

const logger = createLogger({
	format: combine(
		label({
			label: "[LOGGER]",
		}),
		timestamp({
			format: "DD-MM-YYYY HH:mm:ss",
		}),
		customFormat,
		colorize({
			all: true,
		})
	),
	level: "info",
	transports: [
		new transports.Console({ level: "info" }),
		new transports.File({ filename: "./src/utils/logs/warn.log", level: "warn" }),
		new transports.File({ filename: "./src/utils/logs/error.log", level: "error" }),
	],
});

const loggerE = createLogger({
	format: combine(
		label({
			label: "[LOGGER]",
		}),

		timestamp({
			format: "DD-MM-YYYY HH:mm:ss",
		}),
		customFormat,
		colorize({
			all: true,
		})
	),
	level: "error",
	transports: [
		new transports.Console({ level: "error" }),
		new transports.File({ filename: "./src/utils/logs/error.log", level: "error" }),
	],
});
module.exports = { logger, loggerE };
