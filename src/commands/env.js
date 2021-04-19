'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const config = require('../../config/config');

const command = {
    name: 'env',
    syntax: [
        '--env'
    ],
    helpText: 'Set environment to either "prod" or "dev"',
    handler: handler,
    after: ['target', 'version']
};

tcommands.register(command);

async function handler() {
    const env = tcommands.getArgValue('env');
    if (!(env === 'prod' || env === 'dev')) {
        console.log('Environment must be either "prod" or "dev"');
        process.exit(1);
    }
    tempData.put('env', env);
    console.log(`Now using Gravitee ${env} environment`);
    console.log();
    console.log(`Gateway: ${config.gravitee.envs[env].gateway}`);
    console.log(`Endpoint: ${config.gravitee.envs[env].endpoint}`);
    console.log();
}
