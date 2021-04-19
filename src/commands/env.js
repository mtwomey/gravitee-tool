'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const config = require('../../config/config');
const utils = require('../../lib/utils');

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
    const envNames = Object.keys(config.gravitee.envs);
    if (!env || !envNames.includes(env)) {
        console.log(`You must choose an environment with --env to set and store your environment in temp storage.`);
        console.log();
        for (const envName of envNames){
            console.log(`--env ${envName}`);
        }
        process.exit(1);
    }

    tempData.put('env', env);
    console.log(`Now using Gravitee ${env} environment`);
    console.log();
    console.log(`Gateway: ${config.gravitee.envs[env].gateway}`);
    console.log(`Endpoint: ${config.gravitee.envs[env].endpoint}`);
    console.log();
}
