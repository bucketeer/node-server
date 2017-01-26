"use strict";

require("rootpath")();

module.exports = (settings, server) => {
	server.use("/api/users", require("components/api/users/users.routes"));
	server.use("/api/goals", require("components/api/goals/goals.routes"));
	server.use("/api/events", require("components/api/events/events.routes"));
};