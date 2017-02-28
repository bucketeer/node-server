"use strict";

require("rootpath")();

const path = require('path');

module.exports = (settings, server) => {
    server.get("/redirect/client/signin", function(req, res) {
        res.redirect(settings.client.signin);
    });
    server.get("/redirect/client", function(req, res) {
        res.redirect(settings.client.home);
    });
    server.get("/403", function(req, res) {
        res.sendFile(path.join(__dirname, "../views/403.html"));
    });
    server.get("/404", function(req, res) {
        res.sendFile(path.join(__dirname, "../views/404.html"));
    });
    server.get("*", function(req, res) {
        res.sendFile(path.join(__dirname, "../views/404.html"));
    });
};