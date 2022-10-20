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
      const error = Boom.badRequest((err as Error).message);
      return formatJSONResponseError(
        {
          message: error,
        },
        error.output.statusCode,
      );
    });
};

export const main = middyfy(confirm);
