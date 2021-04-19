'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const utils = require('../../lib/utils');
const graviteeMgmt = require('../../lib/graviteeMgmt');
const fs = require('fs');

const command = {
    name: 'importApi',
    syntax: [
        '--import-api'
    ],
    helpText: `Import a previously exported API definition.`,
    handler: handler,
    after: ['env', 'jwt']
};

tcommands.register(command);

async function handler() {
    const env = utils.getEnv();

    const initErrors = [];
    if (tcommands.getArgValue('importApi') === true) initErrors.push('You must specify a filename or '-' for STDIN');
    const jwt = tempData.get(`jwt.${env}`) || initErrors.push(`No JWT found for ${env} environment, use --jwt to specify and store a jwt in temp storage.`);

    if (initErrors.length > 0) {
        for (const error of initErrors) {
            console.log(error);
        }
        process.exit(1);
    }

    const apiDefinition = JSON.parse(fs.readFileSync(tcommands.getArgValue('importApi'), 'utf8'));

    await graviteeMgmt.importApi(env, apiDefinition, jwt);
    console.log(`API ${apiDefinition.name} imported.`);
    await graviteeMgmt.deployApi(env, apiDefinition.id, jwt);
    console.log(`API ${apiDefinition.name} deployed.`);
    await graviteeMgmt.startApi(env, apiDefinition.id, jwt);
    console.log(`API ${apiDefinition.name} started.`);

    console.log(`\n*** ${env} environment ***`);
}
