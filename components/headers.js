"use strict";

module.exports = (settings, server) => {
    server.use(function(req, res, next) {
	    res.header("Access-Control-Allow-Origin", "*");
	    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    next();
	});
};