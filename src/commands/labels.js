'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'labels',
    syntax: [
        '--labels'
    ],
    helpText: 'Specify labels',
    showInHelp: false
};

tcommands.register(command);

