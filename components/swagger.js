"use strict";

require("rootpath")();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const argv = require("minimist")(process.argv.slice(2));
const swaggerApp = express();
const swaggerExpress = require("swagger-node-express").createNew(swaggerApp);
const winston = require("winston");

module.exports = (settings, server) => {
swaggerApp.use(express.static(path.join(__dirname, "../swagger")));
   swaggerExpress.setApiInfo({
        title: "settings.project.title",
        description: settings.project.description,
        termsOfServiceUrl: "",
        contact: "arunv4700@gmail.com",
        license: "",
        licenseUrl: ""
    });
    require("./cors")(settings, swaggerApp);
    swaggerApp.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../swagger/index.html"));
    });
    swaggerExpress.configureSwaggerPaths("", "api-docs", "");
    swaggerExpress.configure(`${settings.server.http.host}:${settings.server.http.port}`, "1.0.0");
    server.use("/", swaggerApp); 
    winston.info(`API documentation can be viewed at ${settings.server.http.host}:${settings.server.http.port}`);   
};
