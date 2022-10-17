import { CognitoIdentityServiceProvider } from "aws-sdk";
import { formatJSONResponseError } from "../libs/api-gateway";

const identityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.REGION,
});

export const authMiddleware = () => {
  const customMiddlewareBefore = async (request) => {
    const { event } = request;
    const userEmail = event.body.email;
    const userPass = event.body.password;

    const token = event.headers["Authorization"].split(" ")[1];
    const rawUser = await identityServiceProvider
      .getUser({ AccessToken: token })
      .promise();
    const email = rawUser.UserAttributes.find((attr) => attr.Name === "email")
      ?.Value!;
    const password = rawUser.UserAttributes.find(
      (attr) => attr.Name === "password",
    )?.Value!;

    if (userEmail === email && userPass === password) {
      return;
    } else {
      return formatJSONResponseError(
        {
          message: `Invalid token`,
        },
        400,
      );
    }
  };
  return {
    before: customMiddlewareBefore,
  };
};
