import schema from "./schema";
import { handlerPath } from "../../libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "hello",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
        authorizer: {
          name: 'MyAuthorizer',
          type: 'COGNITO_USER_POOLS',
          arn: 'arn:aws:cognito-idp:us-east-1:344387451641:userpool/us-east-1_CIHwDAAt7'
        }
      },
      authoriser: {
        cognitoUserPool: {
          pool: "image-s3-pool",
          trigger: "PostConfirmation",
        },
      },
    },
  ],
};
