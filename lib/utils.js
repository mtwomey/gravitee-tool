'use strict';

const fs = require('fs');
const tempData = require('../lib/tempData');
const config = require('../config/config');

function renderTemplate(templateName, variables) {
    // Future me: what this does is read in the specified template file as text, prepends 'variables' to all the variable names,
    // and then evals it as a template literal. The point is to have the template be manageable like a typical
    // JSON snippet, but with variables in it (for ease of editing and managing).
    const rawTemplate = fs.readFileSync(`${__dirname}/../templates/${templateName}.template`, 'utf8');
    return eval(`\`${rawTemplate.replaceAll('${', '${variables.')}\``);
}

function getEnv() {
    const env = tempData.get('env');
    if (!env) {
        console.log(`You must choose an environment with --env to set and store your environment in temp storage.`);
        console.log();
        for (const envName of Object.keys(config.gravitee.envs)){
            console.log(`--env ${envName}`);
        }
        process.exit(1);
    }
    return env;
}

module.exports = {
    renderTemplate,
    getEnv
}
