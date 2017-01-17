"use strict";

require("rootpath")();

// Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const server = express();
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const winston = require("winston");

// Parsers
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(cookieParser());

// Components
require("components/logger")(settings, server);
require("components/database")(settings, server);
require("components/headers")(settings, server);
require("components/cors")(settings, server);
require("components/apiRoutes")(settings, server);
require("components/swagger")(settings, server);
require("components/errorRoutes")(settings, server);

// Initialize
server.listen(settings.server.http.port, () => {
    winston.info(`${settings.project.title} successfully launched: ${settings.server.http.host}:${settings.server.http.port}`);
});
