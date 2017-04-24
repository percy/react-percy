#!/usr/bin/env node

const chalk = require('chalk');

require('../lib/cli').run(process.argv.slice(2))
    .then(() => process.on('exit', () => process.exit(0)))
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error: ', err);
        process.on('exit', () => process.exit(1));
    });
