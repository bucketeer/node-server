"use strict";

require("rootpath")();

const cors = require("cors");

module.exports = (settings, server) => {
	var corsOptions = {
		origin: function (origin, callback) {
			var isWhitelisted = settings.server.whitelist.indexOf(origin) !== -1;
			callback(null, isWhitelisted);
		},
		credentials: true
	}
	server.use(cors(corsOptions));
};