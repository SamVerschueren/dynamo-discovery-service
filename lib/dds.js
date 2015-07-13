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
            KeyConditionExpression: '#n=:name',
            ExpressionAttributeNames: {
                '#n': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name
            },
            ScanIndexForward: false
        };
        
        if(majorVersion) {
            if(minorVersion === 'x') {
                params.KeyConditionExpression += ' AND version BETWEEN :minVersion AND :maxVersion';
                params.ExpressionAttributeValues[':minVersion'] = parseInt(majorVersion);
                params.ExpressionAttributeValues[':maxVersion'] = parseInt(majorVersion)+1;
            }
            else {
                params.KeyConditionExpression += ' AND version=:version';
                params.ExpressionAttributeValues[':version'] = parseFloat(version);
            }
        }
        
        console.log(params);
        
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