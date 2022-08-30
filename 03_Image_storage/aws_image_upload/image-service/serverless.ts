import type { AWS } from '@serverless/typescript';

import getImages from '@functions/getImages';
import getUrl from '@functions/getUrl';
import postImage from '@functions/postImage';
import deleteImage from '@functions/deleteImage';

require('dotenv').config();

const serverlessConfiguration: AWS = {
  service: 'image-service',
  frameworkVersion: '3',
  plugins: ['serverless-webpack','serverless-offline', 'serverless-layers'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BUCKET_NAME: process.env.BUCKET_NAME,
      REGION: process.env.REGION,
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
      TABLE_NAME: process.env.TABLE_NAME,
      USER_POOL_NAME: process.env.USER_POOL_NAME,
      COGNITO_ARN: process.env.COGNITO_ARN,
      
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',      
    },
    region: 'us-east-1',
    alb:{
      authorizers:{
          "Cognito":{
            type: "cognito",
            userPoolArn: "arn:aws:cognito-idp:us-east-1:344387451641:userpool/us-east-1_CIHwDAAt7",
            userPoolClientId: "3ebo75r6gul173m7fso9o2chka",
            userPoolDomain: "e3ygsvc037",
            onUnauthenticatedRequest: "authenticate",
          }
        ,
        
      }
    }
  },
  resources:{
    Resources:{
      // MyApi: {
      //   Type: 'AWS::Serverless::Api',
      //   Properties: {
      //     StageName: "Prod",
      //     Cors: "'*'",
      //     Auth: {
      //       DefaultAuthorizer: 'MyCognitoAuthorizer',
      //       Authorizers: {
      //         MyCognitoAuthorizer: {
      //           UserPoolArn: 'arn:aws:cognito-idp:us-east-1:344387451641:userpool/us-east-1_CIHwDAAt7'
      //         }
                
      //       }
              
      //     }
            
      //   }
          
      // },
        
      // imageS3bucket: {
      //   Type: 'AWS::S3::Bucket',
      //   Properties:{
      //     BucketName: 'image-s3bucket-storage-next',
      //     CorsConfiguration:{
      //       CorsRules:[
      //         {
      //           AllowedHeaders: ["*"],
      //           AllowedMethods: ["GET", "POST", "DELETE"],
      //           AllowedOrigins: ["*"]
      //         },
      //       ]
      //     }

      //   }
      // },
      CognitoUserPool:{
        Type: 'AWS::Cognito::UserPool',
      }, 
      UsersTable:{
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "userimages",
          AttributeDefinitions:[
            {
              AttributeName: 'user',
              AttributeType: 'S'
            },
            {
              AttributeName: 'imageHash',
              AttributeType: 'S'
            }
          ],
          KeySchema:[
            {
              AttributeName: 'user',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'imageHash',
              KeyType: 'RANGE'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST'
            
        }
      }
        

    }
  },
  // import the function via paths
  functions: { getImages, postImage, deleteImage, getUrl },
  package: { individually: true },
  custom: {
    webpack:
    {
      webpackConfig: 'webpack.config.js',
      includeModules: false, 
      packager: 'npm', 
      excludeFiles: 'src/**/*.test.js',
    },
    tableName: 'userimages',
    "serverless-layers":{
       functions:{ getImages, postImage, deleteImage, getUrl },
       dependenciesPath: './package.json',
       layersDeploymentBucket: 'image-s3bucket-storage-next'
    }

  },

};

module.exports = serverlessConfiguration;
