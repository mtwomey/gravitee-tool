'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'description',
    syntax: [
        '--description'
    ],
    helpText: 'Specify description',
    showInHelp: false
};

tcommands.register(command);

