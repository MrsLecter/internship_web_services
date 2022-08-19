import type { AWS } from '@serverless/typescript';

import signin from '@functions/signin';
import logout from '@functions/confirm';
import signup from '@functions/signup';

require('dotenv').config();

const serverlessConfiguration: AWS = {
  service: 'auth-service',
  frameworkVersion: '3',
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      USER_POOL: process.env.USER_POOL_ID,
      CLIENT: process.env.CLIENT_ID,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    region: 'us-east-1'
  },
  // import the function via paths
  functions: { signin, logout, signup },
  package: { individually: true },
  custom: {
    webpack:
    {
      webpackConfig: 'webpack.config.js',
      includeModules: false,
      packager: 'npm',
      excludeFiles: 'src/**/*.test.js', 
    }   
  },
};

module.exports = serverlessConfiguration;
