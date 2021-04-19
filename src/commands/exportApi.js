'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const axios = require('axios');
const utils = require('../../lib/utils');
const gravitee = require('../../lib/graviteeMgmt');

const command = {
    name: 'exportApi',
    syntax: [
        '--export-api'
    ],
    helpText: 'Get importable API Definition',
    handler: handler,
    after: ['env', 'jwt']
};

tcommands.register(command);

async function handler() {
    const env = utils.getEnv();

    const initErrors = [];
    if (tcommands.getArgValue('exportApi') === true) initErrors.push('You must specify an API ID (--export-api [API ID])');
    const jwt = tempData.get(`jwt.${env}`) || initErrors.push(`No JWT found for ${env} environment, use --jwt to specify and store a jwt in temp storage.`);

    if (initErrors.length > 0) {
        for (const error of initErrors) {
            console.log(error);
        }
        process.exit(1);
    }

    const id = tcommands.getArgValue('exportApi');

    let apiDefinition = (await gravitee.getApiExport(env, id, jwt)).data;

    console.log(JSON.stringify(apiDefinition, null, 2));
}
