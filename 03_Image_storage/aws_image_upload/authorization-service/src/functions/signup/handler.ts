import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import cognitoRoutes from "../../libs/cognito-routes";
import schema from "./schema";
import * as Boom from "@hapi/boom";
import * as Joi from "joi";

const joiSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "me", "ua"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const email = event.body.email;
  const password = event.body.password;

  try {
    const valueValid = joiSchema.validate({ email: email, password: password });
    if (valueValid.hasOwnProperty("error")) {
      throw new Error(valueValid.error.details[0].message);
    }
  } catch (err) {
    const error = Boom.badRequest((err as Error).message);
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  return cognitoRoutes
    .signUp({ email, password })
    .then(() => {
      return formatJSONResponse({
        message: `User with email ${email} is created. The verification code was sent to the specified address`,
      });
    })
    .catch((err) => {
      const error = Boom.badRequest((err as Error).message);
      return formatJSONResponseError(
        {
          message: error,
        },
        error.output.statusCode,
      );
    });
};

export const main = middyfy(signup);
