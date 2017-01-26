"use strict";

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const morganRotator = require("file-stream-rotator");
const winston = require("winston");
const winstonRotator = require("winston-daily-rotate-file");

module.exports = (settings, server) => {
	if (!settings.server.logs.persist) {
		return;
	}

	let logDir = `${settings.rootPath}${settings.server.logs.dir}/`;
	fs.existsSync(logDir) || fs.mkdirSync(logDir);

	// Morgan for HTTP calls
	let accessLogStream = morganRotator.getStream({
		date_format: "YYYY-MM-DD",
		filename: path.join(logDir, "%DATE%-access.log"),
		frequency: "daily",
		verbose: true
	});

	server.use(morgan(settings.server.logs.logger, {
		format: settings.server.logs.format,
		stream: accessLogStream
	}));

	// Winston for general logging
	winston.configure({
		transports: [
			new(winston.transports.Console)({
				handleExceptions: true
			}),
			new(winston.transports.DailyRotateFile)({
				filename: `${logDir}debug.log`,
				datePattern: "yyyy-MM-dd-",
				prepend: true,
				level: "debug",
				name: "debug-file"
			}),
			new(winston.transports.DailyRotateFile)({
				filename: `${logDir}info.log`,
				datePattern: "yyyy-MM-dd-",
				prepend: true,
				level: "info",
				name: "info-file"
			}),
			new(winston.transports.DailyRotateFile)({
				filename: `${logDir}warn.log`,
				datePattern: "yyyy-MM-dd-",
				prepend: true,
				level: "warn",
				name: "warn-file"
			}),
			new(winston.transports.DailyRotateFile)({
				filename: `${logDir}error.log`,
				datePattern: "yyyy-MM-dd-",
				prepend: true,
				level: "error",
				name: "error-file"
			}),
			new(winston.transports.DailyRotateFile)({
				filename: `${logDir}unhandled-exceptions.log`,
				datePattern: "yyyy-MM-dd-",
				prepend: true,
				level: "error",
				name: "exceptions-file",
				handleExceptions: true
			})
		]
	});
};