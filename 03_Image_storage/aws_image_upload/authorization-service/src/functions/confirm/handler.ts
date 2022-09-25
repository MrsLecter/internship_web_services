import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import cognitoRoutes from "../../libs/cognito-routes";

import schema from "./schema";

const Boom = require("@hapi/boom");
const Joi = require("joi");

const joiSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "me", "ua"] },
  }),
  code: Joi.string().length(6),
});

const confirm: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const email = event.body.email;
  const code = event.body.code;

  try {
    const valueValid = joiSchema.validate({ email: email, code: code });
    if (valueValid.hasOwnProperty("error")) {
      throw new Error(valueValid.error.details[0].message);
    }
  } catch (err) {
    const error = Boom.badRequest((err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  return cognitoRoutes
    .confirmSignUp({ email, code })
    .then(() => {
      return formatJSONResponse({
        message: `Email ${email} confirmed!`,
        event,
      });
    })
    .catch((err) => {
      return formatJSONResponseError(
        {
          message: err,
        },
        400,
      );
    });
};

export const main = middyfy(confirm);
