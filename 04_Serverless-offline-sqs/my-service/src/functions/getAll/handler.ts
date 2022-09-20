import { formatJSONResponse, formatJSONResponseError } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { getData } from "../../libs/db-client";

const Boom = require("@hapi/boom");

const getall = async () => {
  return getData()
    .then((users: Array<string>) => {
      return formatJSONResponse({
        amount: users.length,
        message: users,
      });
    })
    .catch((err) => {
      const error = Boom.badRequest((err as Error).message);
      error.output.statusCode = 400;
      error.reformat();
      return formatJSONResponseError(
        {
          message: error,
        },
        error.output.statusCode,
      );
    });
};

export const main = middyfy(getall);
