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
    tlds: { allow: ["com", "net", "ua", "me"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const signin: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
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
    .signIn({ email, password })
    .then((data) => {
      return formatJSONResponse({
        message: data,
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

export const main = middyfy(signin);
