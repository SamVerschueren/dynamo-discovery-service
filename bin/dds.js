#!/usr/bin/env node

'use strict';

/**
 * Register your service by using one of the following commands.
 * 
 *     dds configure --accessKeyId :key --secretAccessKey :secret --region eu-west-1
 *     dds set mongo --host 10.9.128.3 --port 4444 --version 1.2
 *     dds set mongo@1.2 10.9.128.3:4444
 * 
 * The default port is 80 and the default version is 1.0
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  3 Jul. 2015
 */

// module dependencies
var AWS = require('aws-sdk'),
    fs = require('fs'),
    path = require('path'),
    os = require('os'),
    minimist = require('minimist'),
    pwuid = require('pwuid');

// Parse the arguments
var argv = minimist(process.argv.slice(2), {
    string: ['host', 'version', 'accessKeyId', 'secretAccessKey', 'region'],
    default: {
        port: 80,
        version: '1.0',
        region: 'us-west-1'
    }
});

// Run the task
runTask(argv._[0]);

function runTask(task) {
    if(task === undefined) {
        throw new Error('Please provide a task.');
    }
    
    if(task === 'configure') {
        var credentials = [],
            config = [];
        
        // Set the credentials
        credentials.push('[default]');
        credentials.push('aws_access_key_id=' + argv.accessKeyId);
        credentials.push('aws_secret_access_key=' + argv.secretAccessKey);
        
        // Set the config
        config.push('[default]');
        config.push('region=' + argv.region);
        config.push('output=json');
        
        fs.writeFileSync(path.join(pwuid().dir, '/.aws/credentials'), credentials.join(os.EOL));
        fs.writeFileSync(path.join(pwuid().dir, '/.aws/config'), config.join(os.EOL));
    }
    else if(task === 'set') {
        var key = argv._[1],
            host = argv.host,
            port = argv.port,
            version = argv.version.split('.');
        
        console.log(key + '@' + version.join('.') + '=' + host + ':' + port);
    }
};