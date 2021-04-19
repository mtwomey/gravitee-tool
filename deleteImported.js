'use strict';

const fs = require('fs');
const graviteeMgmt = require('./lib/graviteeMgmt');
const tempData = require('./lib/tempData');
const config = require('./config/config');
const axios = require('axios');

const tykData = JSON.parse(fs.readFileSync('tyk-dev-apis_20210404.json'));

const jwt = tempData.get('jwt');

main();

async function main() {
    let apis = (await axios.get(`${config.gravitee.endpoint}/apis?label=Tyk Dev Import`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })).data;

    for (const oneApi of apis) {
        const id = oneApi.id;


        // Get api and also full api export
        let api;
        let apiExport;
        try {
            [api, apiExport] = (await Promise.all([graviteeMgmt.getApi(id, jwt), graviteeMgmt.getApiExport(id, jwt)])).map(result => result.data);
            // Stop the API
            if (api.state === 'started') {
                await graviteeMgmt.stopApi(id, jwt);
                console.log(`API "${apiExport.name}" stopped.`);
            }

            // Unpublish the API if it's published
            if (api.lifecycle_state === 'published') {
                await graviteeMgmt.unpublishApi(api, jwt);
                console.log(`API "${apiExport.name}" unpublished.`);
            }

            // Close all published API Plans
            for (const plan of apiExport.plans.filter(plan => plan.status === 'PUBLISHED')) {
                await graviteeMgmt.closePlan(id, plan.id, jwt);
                console.log(`Plan "${plan.name}" closed.`);
            }

            // Delete the API
            await graviteeMgmt.deleteApi(id, jwt);
            console.log(`API "${apiExport.name}" deleted.`);
        } catch (e) {
            console.log(e.response.data.message);
            // process.exit(1);
        }







    }

    let x = 10;
}




