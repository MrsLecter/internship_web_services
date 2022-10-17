import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import { APIGatewayEvent } from "aws-lambda";
import * as Boom from "@hapi/boom";
import { middyfy } from "../../libs/lambda";

import databaseRouts from "../../controllers/db-controller";
import s3Routs from "../../controllers/s3-controller";

const postImage = async (event: APIGatewayEvent) => {
  const userEmail = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters["name"];

  if (!imageName && !event.body) {
    const error = Boom.badRequest(
      "You need to upload a file and enter its name",
    );
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  try {
    await databaseRouts.postImage(userEmail, imageName);
    await s3Routs.uploadImage(imageName, event.body);
  } catch (error: any) {
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  return formatJSONResponse({
    message: `Image [${imageName}] added by [${userEmail}] to bucket `,
  });
};

export const main = middyfy(postImage);
