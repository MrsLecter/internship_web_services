import { CognitoIdentityServiceProvider } from "aws-sdk";
import { formatJSONResponseError } from "./api-gateway";

const identityServiceProvider = new CognitoIdentityServiceProvider({
  region: process.env.REGION,
});

export const authMiddleware = () => {
  const customMiddlewareBefore =async (request) => {
    const { event } = request;
    //user data
    const userEmail = event.body.email;
    const userPass = event.body.password;
    
    //inject user data from token
    const token = event.headers["Authorization"].split(" ")[1];
    const rawUser = await identityServiceProvider
      .getUser({ AccessToken: token })
      .promise();
    const email = rawUser.UserAttributes.find((attr) => attr.Name === "email")
      ?.Value!;
    const password = rawUser.UserAttributes.find(
      (attr) => attr.Name === "password"
    )?.Value!;

    if (userEmail == email && userPass == password) {
      return;
    } else {
      return formatJSONResponseError(
        {
          message: `Invalid token`,
        },
        400
      );
    }
  };
  return {
    before: customMiddlewareBefore,
  };
};
