import { handlerPath } from "../../libs/handler-resolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "getimages",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
        authorizer: {
          name: "MyAuthorizer",
          type: "COGNITO_USER_POOLS",
          arn: process.env.COGNITO_ARN,
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
