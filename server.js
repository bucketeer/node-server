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
server.use(bodyParser.urlencoded({extended: false}));
server.use(cookieParser());

// components
require("components/logger")(settings, server);
require("components/database")(settings, server);
require("components/headers")(settings, server);
require("components/cors")(settings, server);
require("components/apiRoutes")(settings, server);
require("components/swagger")(settings, server);
require("components/errorRoutes")(settings, server);

// initialize
server.listen(settings.server.http.port, () => {
    winston.info(`${settings.project.title} up, on localhost: ${settings.server.http.host}:${settings.server.http.port}`);
    winston.info(`${settings.project.title} up, on network: http://${settings.server.networkIP}:${settings.server.http.port}`);    
});
