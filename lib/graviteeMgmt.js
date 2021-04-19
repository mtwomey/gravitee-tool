'use strict';
const axios = require('axios');
const config = require('../config/config');
const util = require('../lib/utils');
const tempData = require('../lib/tempData');

function closePlan(env, apiId, planId, jwt) {
    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/${apiId}/plans/${planId}/_close`, null, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function deletePlan(env, apiId, planId, jwt) {
    return axios.delete(`${config.gravitee.envs[env].endpoint}/apis/${apiId}/plans/${planId}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function getApiExport(env, apiId, jwt) {
    return axios.get(`${config.gravitee.envs[env].endpoint}/apis/${apiId}/export?exclude=&version=default`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function importApi(env, apiDefinition, jwt) {
    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/import`, apiDefinition, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

function getApi(env, apiId, jwt) {
    return axios.get(`${config.gravitee.envs[env].endpoint}/apis/${apiId}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function getApis(env, jwt) {
    return axios.get(`${config.gravitee.envs[env].endpoint}/apis`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function stopApi(env, apiId, jwt) {
    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/${apiId}?action=STOP`, null,{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function startApi(env, apiId, jwt) {
    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/${apiId}?action=START`, null,{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function deployApi(env, apiId, jwt) {
    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/${apiId}/deploy`, {},{
        headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
}

function unpublishApi(env, api, jwt) {
    // There are discrepancies about what all can / can't be in here in the swagger, I took this by capturing what the web UI was doing
    let data = {
        name: api.name,
        version: api.version,
        description: api.description,
        services: api.services,
        visibility: api.visibility,
        tags: api.tags,
        picture: api.picture,
        categories: api.categories,
        labels: api.labels,
        groups: api.groups,
        metadata: api.metadata,
        proxy: api.proxy,
        flows: api.flows,
        properties: api.properties,
        flow_mode: api.flow_mode,
        picture_url: api.picture_url,
        path_mappings: api.path_mappings,
        response_templates: api.response_templates,
        lifecycle_state: 'unpublished'
    }
    data.plans = api.plans.map(plan => {
        return {
            id: plan.id,
            name: plan.name,
            security: plan.security,
            securityDefinition: plan.securityDefinition,
            paths: plan.paths,
            api: plan.api,
            flows: plan.flows,
            tags: plan.tags,
            status: plan.status
        }
    });
    return axios.put(`${config.gravitee.envs[env].endpoint}/apis/${api.id}`, data,{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function deleteApi(env, apiId, jwt) {
    return axios.delete(`${config.gravitee.envs[env].endpoint}/apis/${apiId}`,{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
}

function createApi(env, templateName, variables, jwt) {
    if (!variables.labels)
        variables.labels = [];
    if (!variables.description)
        variables.description = variables.name;
    if (!variables.cors)
        variables.cors = {};

    for (const [key, value] of Object.entries(variables)) {
        variables[key] = JSON.stringify(value);
        variables[key].replaceAll('""', '"');
    }
    const data = util.renderTemplate(templateName, variables);

    return axios.post(`${config.gravitee.envs[env].endpoint}/apis/import`, data, {
        headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });
}

module.exports = {
    closePlan,
    deletePlan,
    getApi,
    getApiExport,
    stopApi,
    unpublishApi,
    deleteApi,
    createApi,
    startApi,
    deployApi,
    getApis,
    importApi
};


