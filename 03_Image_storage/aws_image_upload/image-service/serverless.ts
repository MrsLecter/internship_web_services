import type { AWS } from "@serverless/typescript";

import getImages from "@functions/getImages";
import getUrl from "@functions/getUrl";
import postImage from "@functions/postImage";
import deleteImage from "@functions/deleteImage";

require("dotenv").config();

const serverlessConfiguration: AWS = {
  service: "image-service",
  frameworkVersion: "3",
  plugins: ["serverless-webpack", "serverless-offline", "serverless-layers"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: process.env.DYNAMO_ARN,
          },
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: process.env.COGNITO_ARN,
          },
        ],
      },
    },
    environment: {
      BUCKET_NAME: process.env.BUCKET_NAME,
      REGION: process.env.REGION,
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
      TABLE_NAME: process.env.TABLE_NAME,
      USER_POOL_NAME: process.env.USER_POOL_NAME,
      COGNITO_ARN: process.env.COGNITO_ARN,

      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    region: "us-east-1",
    alb: {
      authorizers: {
        Cognito: {
          type: "cognito",
          userPoolArn: process.env.USER_POOL_ARN,
          userPoolClientId: process.env.USER_POOL_CLIENT_ID,
          userPoolDomain: process.env.USER_POOL_DOMAIN,
          onUnauthenticatedRequest: "authenticate",
        },
      },
    },
  },
  resources: {
    Resources: {
      MyApi: {
        Type: "AWS::Serverless::Api",
        Properties: {
          StageName: "Prod",
          Cors: "'*'",
          Auth: {
            DefaultAuthorizer: "MyCognitoAuthorizer",
            Authorizers: {
              MyCognitoAuthorizer: {
                UserPoolArn: process.env.USER_POOL_ARN,
              },
            },
          },
        },
      },

      imageS3bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "image-s3bucket-storage-next",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "POST", "DELETE"],
                AllowedOrigins: ["*"],
              },
            ],
          },
        },
      },
      UsersTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "userimages",
          AttributeDefinitions: [
            {
              AttributeName: "user",
              AttributeType: "S",
            },
            {
              AttributeName: "imageHash",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "user",
              KeyType: "HASH",
            },
            {
              AttributeName: "imageHash",
              KeyType: "RANGE",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
  functions: { getImages, postImage, deleteImage, getUrl },
  package: { individually: true },
  custom: {
    "webpack": {
      webpackConfig: "webpack.config.js",
      includeModules: false,
      packager: "npm",
      excludeFiles: "src/**/*.test.js",
    },
    "tableName": "userimages",
    "serverless-layers": {
      functions: { getImages, postImage, deleteImage, getUrl },
      dependenciesPath: "./package.json",
      layersDeploymentBucket: "image-s3bucket-storage-next",
    },
  },
};

module.exports = serverlessConfiguration;
