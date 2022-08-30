import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
import { middyfy } from "../../libs/lambda";

const { dynamoDB } = require("../../libs/db-client");
const { s3Client } = require("../../libs/s3-client");

const CryptoJS = require("crypto-js");

import schema from './schema';

// error handler
const Boom = require("@hapi/boom");

//configure constant
const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userEmail = event.body.email;
  const imageName = event.queryStringParameters["name"];

  //-----delete from bucket -----
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
      error.output.statusCode
    );
  }
  //-----/delete from bucket -----

  //-----delete from db-----
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
      error.output.statusCode
    );
  }
  //-----delete from db-----

  return formatJSONResponse({
    message: `Image [${imageName}] deleted by user [${userEmail}]`,
  });
};

export const main = middyfy(deleteImage);
