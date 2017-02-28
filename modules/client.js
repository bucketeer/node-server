"use strict";

require("rootpath")();

const path = require('path');
const express = require("express");

module.exports = (settings, server) => {
    server.use(express.static(path.join(__dirname, "../dist")));
    server.get(settings.server.components.client.endpoint, function(req, res) {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
    });
};