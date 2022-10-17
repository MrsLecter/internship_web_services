import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import databaseRouts from "../../controllers/db-controller";
import s3Routs from "../../controllers/s3-controller";
import schema from "./schema";
import * as Boom from "@hapi/boom";

const deleteImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const userEmail = event.body.email as string;
  const imageName = event.queryStringParameters.name as string;

  if (!userEmail && !imageName) {
    const error = Boom.badRequest("User email and image name not found!");
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  try {
    await s3Routs.deleteImage(imageName);
  } catch (err: any) {
    const error = Boom.badRequest("S3Client error: " + (err as Error).message);
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }
  try {
    await databaseRouts.deleteImage(imageName, userEmail);
  } catch (error: any) {
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  return formatJSONResponse({
    message: `Image [${imageName}] deleted by user [${userEmail}]`,
  });
};

export const main = middyfy(deleteImage);
