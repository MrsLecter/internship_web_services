import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { middyfy } from "../../libs/lambda";
import { dynamoDB } from "../../libs/db-client";
import { s3Client } from "../../libs/s3-client";

const CryptoJS = require("crypto-js");

import schema from "./schema";

const Boom = require("@hapi/boom");
const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
) => {
  const userEmail = event.body.email;
  const imageName = event.queryStringParameters["name"];

  try {
    const params = { Key: imageName, Bucket: BUCKET_NAME };
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    const error = Boom.badRequest("S3Client error" + (err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }

  try {
    const paramsDelete = {
      Key: {
        user: {
          S: userEmail,
        },
        imageHash: {
          S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
        },
      },
      TableName: process.env.TABLE_NAME,
    };
    await dynamoDB.deleteItem(paramsDelete).promise();
  } catch (err) {
    const error = Boom.badRequest("DynamoDB error" + (err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
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
