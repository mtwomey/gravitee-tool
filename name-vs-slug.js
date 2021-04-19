'use strict';

const fs = require('fs');
const graviteeMgmt = require('./lib/graviteeMgmt');
const tempData = require('./lib/tempData');
const config = require('./config/config');

const tykData = JSON.parse(fs.readFileSync('tyk-prod-apis_20210413.json'));

const jwt = tempData.get('jwt');

main();

async function main() {
    for (let i = 0; i < tykData.apis.length; i++) {
    // for (let i = 0; i < 1; i++) {
        let tykApi = tykData.apis[i];
        const target = tykApi.api_definition.proxy.target_url;
        let contextPath = `${tykApi.api_definition.name}`;
        if (!contextPath.startsWith('/'))
            contextPath = '/' + contextPath;
        const labels = ['Tyk Prod Import'];
        const cors = {
            enabled: tykApi.api_definition.CORS.enable,
            allowCredentials: tykApi.api_definition.CORS.allow_credentials,
            allowOrigin: tykApi.api_definition.CORS.allowed_origins,
            allowHeaders: tykApi.api_definition.CORS.allowed_headers,
            allowMethods: tykApi.api_definition.CORS.allowed_methods,
            exposeHeaders: tykApi.api_definition.CORS.exposed_headers,
            maxAge: tykApi.api_definition.CORS.max_age
        };

        let api;
        // if (!tykApi.api_definition.name.startsWith('/'))
        //     tykApi.api_definition.name = '/' + tykApi.api_definition.name;
        //
        // if (!tykApi.api_definition.slug.startsWith('/'))
        //     tykApi.api_definition.slug = '/' + tykApi.api_definition.slug;

        if (prependSlash(tykApi.api_definition.name) !== prependSlash(tykApi.api_definition.slug)) {
            console.log(`Name is: '${tykApi.api_definition.name}' Slug is: '${tykApi.api_definition.slug}' (Target is: '${tykApi.api_definition.proxy.target_url}'`);
        }
        // console.log(contextPath);
        try {
            // api = (await graviteeMgmt.createApi('simpleOpenProxy', {
            //     contextPath,
            //     name: contextPath,
            //     target,
            //     labels,
            //     cors
            // }, jwt)).data;
            // console.log(`API ${contextPath} created.`);
            // await graviteeMgmt.deployApi(api.id, jwt);
            // console.log(`API ${api.name} deployed.`);
            // await graviteeMgmt.startApi(api.id, jwt);
            // console.log(`API ${api.name} started.`);
            // console.log(api.name.padEnd(30) + api.id.padEnd(40) + config.gravitee.gateway + api.context_path);
        } catch (e) {
            console.log(`[gravitee] ${e.response.data.message}`);
            console.log(`API ${contextPath} NOT created.`);
        }
    }
}

function prependSlash(s) {
    if (!(s[0] === '/')) {
        s = '/' + s;
    }
    return s;
}





