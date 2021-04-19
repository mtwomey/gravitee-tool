'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const graviteeMgmt = require('../../lib/graviteeMgmt');
const config = require('../../config/config');
const utils = require('../../lib/utils');

const command = {
    name: 'listApis',
    syntax: [
        '--list-apis'
    ],
    helpText: `List the APIs`,
    handler: handler,
    after: ['env', 'jwt']
};

tcommands.register(command);

async function handler() {
    const env = utils.getEnv();

    const initErrors = [];
    const jwt = tempData.get(`jwt.${env}`) || initErrors.push(`No JWT found for ${env} environment, use --jwt to specify and store a jwt in temp storage.`);

    if (initErrors.length > 0) {
        for (const error of initErrors) {
            console.log(error);
        }
        process.exit(1);
    }

    let apis = (await graviteeMgmt.getApis(env, jwt)).data;
    for (const api of apis) {
        console.log(api.name.padEnd(30) + api.id.padEnd(40) + config.gravitee.gateway + api.virtual_hosts[0].path);
    }
    console.log();
    console.log(`*** ${env} environment ***`);
}
