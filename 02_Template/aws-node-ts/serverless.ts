import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'aws-node-ts',
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    region: 'us-east-1'
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    webpack:
    {
      webpackConfig: 'webpack.config.js', // Name of webpack configuration file
      includeModules: false, // Node modules configuration for packaging
      packager: 'npm', // Packager that will be used to package your external modules
      excludeFiles: 'src/**/*.test.js', // Provide a glob for files to ignore
    }   
  },
};

module.exports = serverlessConfiguration;
