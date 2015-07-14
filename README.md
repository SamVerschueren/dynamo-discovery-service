# Dynamo Discovery Service

> Discovery service like etcd but implemented with DynamoDB

## Installation (not yet available)

```bash
$ npm install --save dds
```

## Introduction

At the AWS Summit in Amsterdam I spoke with [@sebsto](https://twitter.com/sebsto) regarding service discovery. I asked 
him if `etcd` is a good fit. Besides it probably is a good fit, he came up with an alternative idea. What if `etcd` 
fails because the nodes can't find each other?

The idea is to use `DynamoDB` to keep track of the services. The downside is the extra code you have to write for 
each service. This repo will try to tackle that.

## Usage

### Connecting with DynamoDB

```javascript
var dds = require('dds');

// Connect with DynamoDB via the access keys
dds.connect({
    accessKeyId: 'myAccessKey',
    secretAccessKey: 'mySecretAccessKey',
    region: 'eu-west-1'
});
```

### Retrieving a service

By only providing the name of the service, you will retrieve the latest version of the service.

```javascript
// Retrieve the latest mongo service
dds.get('mongo').then(function(mongo) {
    // Connect with the mongodb service
}).catch(function(err) {
    // Handle error
});
```

You can also pass in the version you want to retrieve. You can either specify a specific version, or a non-specific version.

```javascript
// Retrieve a specific mongo service
dds.get('mongo', '1.2').then(function(mongo) {
    // Connect with the mongodb service
}).catch(function(err) {
    // Handle error
});
```

This will retrieve the mongo service with version `1.2`. If you just want to retrieve the latest version within a specific
major version number, you can pass in an `x` as minor version.

```javascript
// Retrieve the latest mongo service
dds.get('mongo', '1.x').then(function(mongo) {
    // Connect with the mongodb service
}).catch(function(err) {
    // Handle error
});
```

If `1.12` is the latest version within major version number `1`, it will retrieve the mongo service with version `1.12`.

## CLI

- [dds-cli](https://github.com/SamVerschueren/dynamo-discovery-service-cli)

## Author

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
