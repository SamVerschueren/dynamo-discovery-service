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

## CLI

- [dds-cli](https://github.com/SamVerschueren/dynamo-discovery-service-cli)

## Author

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
