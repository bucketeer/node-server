"use strict";

require("rootpath")();

// dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const server = express();
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const winston = require("winston");

// parsers
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// modules
require("modules/logger")(settings, server);
require("modules/database")(settings, server);
require("modules/headers")(settings, server);
require("modules/cors")(settings, server);
require("modules/apiRoutes")(settings, server);
require("modules/swagger")(settings, server);
require("modules/graphql")(settings, server);
require("modules/client")(settings, server);
require("modules/errorRoutes")(settings, server);

// initialize
server.listen(settings.server.http.port, () => {
    winston.info(`${settings.project.title} up, on localhost: ${settings.server.http.host}:${settings.server.http.port}`);
    winston.info(`${settings.project.title} up, on network: ${settings.server.networkIP}:${settings.server.http.port}`);
});