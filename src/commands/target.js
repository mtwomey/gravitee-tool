'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'target',
    syntax: [
        '--target'
    ],
    helpText: `Specify the target`
};

tcommands.register(command);
