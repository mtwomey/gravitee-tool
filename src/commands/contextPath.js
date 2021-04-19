'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'contextPath',
    syntax: [
        '--context-path'
    ],
    helpText: `Specify the context path`,
    showInHelp: false
};

tcommands.register(command);
