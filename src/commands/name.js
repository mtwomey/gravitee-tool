'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'name',
    syntax: [
        '--name'
    ],
    helpText: `Specify the name`
};

tcommands.register(command);
