"use strict";

require("rootpath")();

module.exports = (settings, server) => {
	server.use("/api/users", require("modules/users/users.routes"));
	server.use("/api/goals", require("modules/goals/goals.routes"));
	server.use("/api/events", require("modules/events/events.routes"));
};
