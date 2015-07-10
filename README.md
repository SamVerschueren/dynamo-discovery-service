# Dynamo Discovery Service

> Discovery service like etcd but implemented with DynamoDB

## Installation (not yet available)

```bash
$ npm install -g dds
```

## Introduction

At the AWS Summit in Amsterdam I spoke with [@sebsto](https://twitter.com/sebsto) regarding service discovery. I asked 
him if `etcd` is a good fit. Besides it probably is a good fit, he came up with an alternative idea. What if `etcd` 
fails because the nodes can't find each other?

The idea is to use `DynamoDB` to keep track of the services. The downside is the extra code you have to write for 
each service. This repo will try to tackle that.

## CLI

### Configuration

First of all, you need to create a `dds` user in the AWS portal. This user can interact with the DynamoDB database in order to
store and retrieve services from the database.

Go to `AWS -> Identity and Access Management`. Create a new user with the name `dds` and use those credentials to configure the
`dds` service.

> TODO: Add policy

In order for the service to store and read services from the DynamoDB database, you need to configure the credentials of
the `dds` user and the region.

```bash
$ dds configure --accessKeyId <key> --secretAccessKey <secret> --region us-west-1
```

### Store service

To store a service in the database, you can use the following commands.

```bash
$ dds set mongo --host 10.9.128.3 --port 4444 --version 1.2
```

## Author

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
