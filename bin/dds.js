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

// Set the AWS profile to load the correct config
process.env.AWS_PROFILE='dds';

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
        credentials.push('[' + process.env.AWS_PROFILE + ']');
        credentials.push('aws_access_key_id=' + argv.accessKeyId);
        credentials.push('aws_secret_access_key=' + argv.secretAccessKey);
        
        // Set the config
        config.push('[' + process.env.AWS_PROFILE + ']');
        config.push('region=' + argv.region);
        config.push('output=json');
        
        fs.writeFileSync(path.join(pwuid().dir, '/.aws/credentials'), credentials.join(os.EOL));
        fs.writeFileSync(path.join(pwuid().dir, '/.aws/config'), config.join(os.EOL));
    }
    else {
        var awsconfig = parseConfig(path.join(pwuid().dir, '/.aws/config')),
            dynamo = new AWS.DynamoDB(awsconfig[process.env.AWS_PROFILE]);
        
        if(task === 'set') {
            var key = argv._[1],
                host = argv.host,
                port = argv.port,
                version = argv.version.split('.');
            
            var params = {
                TableName: 'dds',
                Item: {
                    name: {
                        'S': key
                    },
                    host: {
                        'S': host
                    },
                    port: {
                        'N': port.toString()
                    },
                    majorVersion: {
                        'N': version[0]
                    },
                    minorVersion: {
                        'N': version[1] || 0
                    }
                }
            }
            
            dynamo.putItem(params, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }   
                
                console.log(result);
            });
        }
    }
};

function parseConfig(path) {
    var content = fs.readFileSync(path).toString();
    
    var result = {},
        currentProfile = undefined,
        temp;
    
    content.split(os.EOL).forEach(function(line) {
        if(temp = /^\[(.*?)\]$/.exec(line)) {
            currentProfile = temp[1];
            
            result[currentProfile] = {};
        }
        else if(temp = /^(.*?)=(.*?)$/.exec(line)) {
            result[currentProfile][temp[1]] = temp[2];
        }
    });
    
    return result;
};