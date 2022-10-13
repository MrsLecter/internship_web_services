import type { AWS } from "@serverless/typescript";
require("dotenv").config();

import getall from "@functions/getAll";
import consumer from "@functions/consumer";
import publisher from "@functions/publisher";

const serverlessConfiguration: AWS = {
  service: "my-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-offline-sqs",
    "serverless-lift",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",

      DB_ENDPOINT: process.env.DB_ENDPOINT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      SQS_URL: process.env.SQS_URL,
      SQS_NAME: process.env.SQS_NAME,
      REGION: process.env.REGION,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["queue1", "Arn"],
          },
        ],
      },
    ],
  },
  //create new que(have already created in custom.conf)
  // resources:{
  //   Resources: {
  //     MyQueue:{
  //       Type: 'AWS::SQS::Queue',
  //       Properties:{
  //           QueueName: 'queue1',
  //           VisibilityTimeout: 60,
  //           MessageRetentionPeriod: 345600,
  //           worker:{
  //             handler: consumer,
  //           }
  //       },
  //     },

  //   }
  // },

  // import the function via paths
  functions: { getall, consumer, publisher },
  package: { individually: true },
  custom: {
    "esbuild": {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },

    "serverless-offline-sqs": {
      debug: false,
      autoCreate: true,
      apiVersion: "2012-11-05",
      endpoint: "http://localhost:9324",
      region: "us-west-2",
      accessKeyId: "root",
      secretAccessKey: "root",
      skipCacheInvalidation: false,
      queueName: "queue1",
    },
  },
};

module.exports = serverlessConfiguration;
