"use strict";

require("rootpath")();

const path = require("path");
const ip = require('ip');

module.exports = {
    project: require("package"),
    rootPath: path.join(__dirname, "../../"),
    database: {
        mongodb: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bucketeer',
            options: {

            }
        }
    },
    server: {
        logs: {
            logger: process.env.LOGGER || "dev",
            persist: true,
            format: "[:date[clf]] :method :url :status :res[content-length] - :response-time ms",
            dir: "logs"
        },
        whitelist: [
            "http://localhost:4400",
            "http://localhost:4200"
        ],
        networkIP: `http://${ip.address()}`,
        http: {
            active: true,
            host: process.env.HTTP_HOST || "http://localhost",
            port: process.env.HTTP_PORT || 4400
        },
        https: {
            active: false,
            host: process.env.HTTP_HOST || "http://localhost",
            port: process.env.HTTPS_PORT || 4444,
            key: 'configs/certificate/key.pem',
            cert: 'configs/certificate/cert.pem'
        },
        components: {
            swagger: {
                endpoint: "/swagger",
            },
            graphql: {
                endpoint: "/graphql",
            },
            client: {
                endpoint: "/"
            }
        }
    },
    api: {
        results: {
            defaultPageSize: 25
        },
        token: {
            secret: process.env.SECRET || "bucketeer",
            options: {
                expiresIn: process.env.TOKEN_EXPIRES || "1hr",
            }
        },
        authenticate: false
    },
    client: {
        home: "http://localhost:4400",
        signin: "http://localhost:4400"
    },
    googleAnalytics: ""

};