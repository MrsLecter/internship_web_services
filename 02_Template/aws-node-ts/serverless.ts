import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";

const serverlessConfiguration: AWS = {
  service: "aws-node-ts",
  frameworkVersion: "3",
  plugins: ["serverless-webpack"],
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
    },
    region: "us-east-1",
  },
  functions: { hello },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: "webpack.config.js",
      includeModules: false,
      packager: "npm",
      excludeFiles: "src/**/*.test.js",
    },
  },
};

module.exports = serverlessConfiguration;
