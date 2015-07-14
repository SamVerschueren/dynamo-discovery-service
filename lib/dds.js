'use strict';

var AWS = require('aws-sdk'),
    DOC = require('dynamodb-doc'),
    Q = require('q');

module.exports = {
    connect: function(aws) {
        AWS.config.update(aws);
        
        var ddb = new AWS.DynamoDB();
        
        this._dynamodb = new DOC.DynamoDB(ddb);
    },
    /**
     * Sets the properties for the service name provided as parameter.
     * 
     * @param {string}  name        The name of the service.
     * @param {object}  options     Extra options like host, port and version.
     */
    set: function(name, options) {
        
    },
    /**
     * Retrieves the properties for the service name and the version provided.
     * 
     * @param {string}  name        The name of the service.
     * @param {string}  version     The version of the service.
     */
    get: function(name, version) {
        var deferred = Q.defer();
        
        var majorVersion, minorVersion;
        
        if(version) {
            var splittedVersion = version.split('.');
            
            majorVersion = splittedVersion[0];
            minorVersion = splittedVersion[1] || 'x';
        }
        
        // Build up the params
        var params = {
            TableName: 'dds',
            KeyConditionExpression: '#name=:name',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            },
            ScanIndexForward: false
        };
        
        if(version) {
            // If the version exists, 
            if(minorVersion === 'x') {
                // If the minor version is set to `x`, we should calculate the highest version number with the correct minor version                
                params.KeyConditionExpression += ' AND versionId BETWEEN :minVersion AND :maxVersion';
                params.ExpressionAttributeValues[':minVersion'] = calcVersionId(majorVersion);
                params.ExpressionAttributeValues[':maxVersion'] = calcVersionId(majorVersion, 1);
            }
            else {
                // If minor version is not set to `x`, we should return the record with the exact version number
                params.KeyConditionExpression += ' AND versionId = :versionId';
                params.ExpressionAttributeValues[':versionId'] = calcVersionId(version);
            }
        }
        
        // Retrieve the item
        this._dynamodb.query(params, function(err, data) {
            if(err) {
                // Reject if an error occurred
                return deferred.reject(err);
            }
            
            console.log(data);
            
            // Resolve the item if everything went succesfully
            deferred.resolve(data.Items[0]);
        });
        
        // Return the promise
        return deferred.promise;
    }
};

function calcVersionId(version, adder) {
    adder = adder || 0;
    
    var splitted = version.toString().split('.'),
        major = tryParseInt(splitted[0], 0) + adder,
        minor = tryParseInt(splitted[1], 0);
    
    console.log(major + ' - ' + minor);
    
    return major*1000000000 + minor;
}

function tryParseInt(str, def) {
    return parseInt(str) || def;
}