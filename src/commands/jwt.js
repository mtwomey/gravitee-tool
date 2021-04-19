'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');

const command = {
    name: 'jwt',
    syntax: [
        '-j',
        '--jwt'
    ],
    helpText: 'Specify a JWT token',
    handler: handler,
    after: ['env']
};

tcommands.register(command);

async function handler() {
    const env = tempData.get('env');
    tempData.put(`jwt.${env}`, tcommands.getArgValue('jwt'));
}
