## Serverless Template

Template for AWS based on Serverless Framework
    
## Include

- NodeJS;
- Typescript;
- Webpack;
- Boom (for error handling);
- Joi (for validation);
- Middy (middleware)

## How to use

1) <code>sls login</code> - to login in aws
2) <code>sls create --tamplate-url [YourGithubTemplate] --path [yourServiceName]</code> - install template

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
