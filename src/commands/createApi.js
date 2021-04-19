'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const graviteeMgmt = require('../../lib/graviteeMgmt');
const config = require('../../config/config');
const utils = require('../../lib/utils');

const command = {
    name: 'createApi',
    syntax: [
        '--create-api'
    ],
    helpText: `Create an API from a template`,
    handler: handler,
    after: ['env', 'jwt']
};

tcommands.register(command);

async function handler() {
    const env = utils.getEnv();

    const initErrors = [];
    let contextPath = tcommands.getArgValue('contextPath') || initErrors.push('--context-path is required');
    let name = tcommands.getArgValue('name') || initErrors.push('--name is required');
    let target = tcommands.getArgValue('target') || initErrors.push('--target is required');
    const jwt = tempData.get(`jwt.${env}`) || initErrors.push(`No JWT found for ${env} environment, use --jwt to specify and store a jwt in temp storage.`);

    if (initErrors.length > 0) {
        console.log('Usage:\n\ngravitee-tool --create-api --name "My API" --context-path "/myapi" --target "https://backend.api" --description "Does stuff" --labels "label1, label2"\n');
        console.log('Errors:\n');
        for (const error of initErrors) {
            console.log(error);
        }
        process.exit(1);
    }

    // Pre-process labels
    let labels = [];
    if (tcommands.getArgValue('labels'))
        labels = tcommands.getArgValue('labels').split(',');

    let api;
    try {
        api = (await graviteeMgmt.createApi(env, 'simpleOpenProxy', {
            contextPath: contextPath,
            name: name,
            target: target,
            labels: labels,
            cors: {
                "enabled": true,
                "allowCredentials": false,
                "allowOrigin": [
                    "*",
                    "mything.com"
                ],
                "allowHeaders": [
                    "x-header-01",
                    "x-header-02"
                ],
                "allowMethods": [
                    "POST",
                    "GET"
                ],
                "exposeHeaders": [],
                "maxAge": -1
            }
        }, jwt)).data;
    } catch (e) {
        console.log(`[gravitee] ${e.response.data.message}`);
        console.log(`API ${name} NOT created.`);
        process.exit(1);
    }
    console.log(`API ${api.name} created.`);

    await graviteeMgmt.deployApi(env, api.id, jwt);
    console.log(`API ${api.name} deployed.`);
    await graviteeMgmt.startApi(env, api.id, jwt);
    console.log(`API ${api.name} started.`);
    console.log(api.name.padEnd(30) + api.id.padEnd(40) + config.gravitee.envs[env].gateway + api.context_path);
}
