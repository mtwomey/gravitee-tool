'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const axios = require('axios');
const utils = require('../../lib/utils');
const graviteeMgmt = require('../../lib/graviteeMgmt');

const command = {
    name: 'deleteApi',
    syntax: [
        '--delete-api'
    ],
    helpText: `Completely removes and API and it's associated plans.`,
    handler: handler,
    after: ['env', 'jwt']
};

tcommands.register(command);

async function handler() {
    const env = utils.getEnv();

    const initErrors = [];
    if (tcommands.getArgValue('deleteApi') === true) initErrors.push('You must specify an API ID (--delete-api [API ID])');
    const jwt = tempData.get(`jwt.${env}`) || initErrors.push(`No JWT found for ${env} environment, use --jwt to specify and store a jwt in temp storage.`);

    if (initErrors.length > 0) {
        for (const error of initErrors) {
            console.log(error);
        }
        process.exit(1);
    }

    const id = tcommands.getArgValue('deleteApi');

    // Get api and also full api export
    let api;
    let apiExport;
    try {
        [api, apiExport] = (await Promise.all([graviteeMgmt.getApi(env, id, jwt), graviteeMgmt.getApiExport(env, id, jwt)])).map(result => result.data);
    } catch (e) {
        console.log(e.response.data.message);
        process.exit(1);
    }

    if (tcommands.getArgValue('confirm')) {
        // Save a backup of the API
        const filename = tempData.put(`${apiExport.id}.export`, apiExport);
        console.log(`Backup '${filename}' saved.\n`);

        // Stop the API
        if (api.state === 'started') {
            await graviteeMgmt.stopApi(env, id, jwt);
            console.log(`API "${apiExport.name}" stopped.`);
        }

        // Unpublish the API if it's published
        if (api.lifecycle_state === 'published') {
            await graviteeMgmt.unpublishApi(env, api, jwt);
            console.log(`API "${apiExport.name}" unpublished.`);
        }

        // Close all published API Plans
        for (const plan of apiExport.plans.filter(plan => plan.status === 'PUBLISHED')) {
            await graviteeMgmt.closePlan(env, id, plan.id, jwt);
            console.log(`Plan "${plan.name}" closed.`);
        }

        // Delete the API
        await graviteeMgmt.deleteApi(env, id, jwt);
        console.log(`API "${apiExport.name}" deleted.`);

        console.log(`\n*** ${env} environment ***`);
    } else {
        console.log(`API "${api.name}" will be deleted in the ${env} environment, add a \`-y\` to the delete command to confirm`);
    }


}
