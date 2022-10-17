import { formatJSONResponseError } from "../libs/api-gateway";
import * as Joi from "joi";

const joiSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const credentialsMiddleware = () => {
  const customMiddlewareBefore = (request) => {
    const { event } = request;
    const userEmail = event.body.email
      ? event.body.email
      : event.queryStringParameters["email"];
    const userPassword = event.body.password
      ? event.body.password
      : event.queryStringParameters["pasword"];

    const valueValid = joiSchema.validate({
      email: userEmail,
      password: userPassword,
    });

    if (valueValid.hasOwnProperty("error")) {
      return formatJSONResponseError(
        {
          message: `Invalid credentials`,
        },
        400,
      );
    } else {
      return;
    }
  };
  return {
    before: customMiddlewareBefore,
  };
};
