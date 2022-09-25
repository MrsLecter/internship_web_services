import { handlerPath } from "../../libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "images",
        cors: true,
        request: {},
        authorizer: {
          name: "MyAuthorizer",
          arn: process.env.COGNITO_ARN,
          identitySource: "method.request.header.Authorization",
          resultTtlInSeconds: 0,
          type: "token",
        },
      },
      authoriser: {
        cognitoUserPool: {
          pool: process.env.USER_POOL_NAME,
        },
      },
    },
  ],
};
