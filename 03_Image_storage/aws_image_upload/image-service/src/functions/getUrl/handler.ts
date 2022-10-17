import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { APIGatewayEvent } from "aws-lambda";
import middy from "@middy/core";
import s3Routs from "../../controllers/s3-controller";
import * as Boom from "@hapi/boom";

const getUrl = async (event: APIGatewayEvent) => {
  const imageName = event.queryStringParameters["name"];

  if (!imageName) {
    const error = Boom.badRequest("Image name not found");
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  const urlObject = await s3Routs.getPresignedPost(imageName);
  if (!urlObject.hasOwnProperty("url") && !urlObject.hasOwnProperty("fields")) {
    console.error("There was an error in the method s3Routs.getPresignedPost");
    throw Boom.badImplementation("PresignedPost is not generated!");
  }

  const { url, fields } = urlObject;

  return formatJSONResponse({
    message: `Url to upload: ${url}, fields: ${fields}`,
  });
};

export const main = middy(getUrl).use(middyJsonBodyParser());
