"use strict";

require("rootpath")();

const buildSchema = require('graphql').buildSchema;
const graphqlExpress = require('express-graphql');


module.exports = (settings, server) => {

    let schema = buildSchema(`
        type Query {
            rollDice(numDice: Int!, numSides: Int): [Int]
        }
    `);

    let root = {
        quoteOfTheDay: () => {
            return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
        },
        random: () => {
            return Math.random();
        },
        rollThreeDice: () => {
            return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
        },
        rollDice: (numDice, numSides) => {
            let output = [];
            for (let i = 0; i < numDice; i++) {
                output.push(1 + Math.floor(Math.random() * (numSides || 6)));
            }
            return output
        }
    };

    let graphqlExpressApp = graphqlExpress({
        schema: schema,
        rootValue: root,
        graphiql: true,
    });

    server.use(settings.server.components.graphql.endpoint, graphqlExpressApp);
};