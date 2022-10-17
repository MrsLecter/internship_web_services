import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import schema from "./schema";
import databaseRouts from "../../controllers/db-controller";
import { getUrlString } from "../../utils/utils";
import * as Boom from "@hapi/boom";

const getImages: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const userEmail = event.body.email as string;

  if (!userEmail) {
    const error = Boom.badRequest("User email name not found");
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  try {
    const images = await databaseRouts.getImages(userEmail);
    const imagesUrls = getUrlString(images);

    return formatJSONResponse({
      message: `${userEmail}'s images: ${imagesUrls}`,
    });
  } catch (error: any) {
    const error = Boom.badRequest("Images not received");
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }
};

export const main = middyfy(getImages);
