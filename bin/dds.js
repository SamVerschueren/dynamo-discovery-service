#!/usr/bin/env node

'use strict';

/**
 * Register your service by using one of the following commands.
 * 
 * $ dds set mongo --host 10.9.128.3 --port 4444 --version 1.2
 * $ dds set mongo@1.2 10.9.128.3:4444
 * 
 * The default port is 80 and the default version is 1.0
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  3 Jul. 2015
 */

// module dependencies
var minimist = require('minimist');

// Parse the arguments
var argv = minimist(process.argv.slice(2), {
    string: ['host', 'version'],
    default: {
        port: 80,
        version: '1.0'
    }
});

// Run the task
runTask(argv._[0]);

function runTask(task) {
    if(task === undefined) {
        throw new Error('Please provide a task.');
    }
    
    if(task === 'set') {
        var key = argv._[1],
            host = argv.host,
            port = argv.port,
            version = argv.version.split('.');
        
        console.log(key + '@' + version.join('.') + '=' + host + ':' + port);
    }
};