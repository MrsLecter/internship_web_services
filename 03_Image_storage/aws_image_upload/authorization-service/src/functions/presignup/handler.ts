import type { Callback } from "aws-lambda";

export const handler = (event: any, _, callback: Callback): void => {
  event.response.autoConfirmUser = false;
  const address = event.request.userAttributes.email.split("@");

  if (event.request.userAttributes.hasOwnProperty("email")) {
    if (event.request.userAttributes["email"] === address[1]) {
      event.response.autoConfirmUser = true;
    }
  }
  callback(null, event);
};
