import {
  formatJSONResponse,
  formatJSONResponseError,
} from "../../libs/api-gateway";
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
import { middyfy } from "../../libs/lambda";

const { dynamoDB } = require("../../libs/db-client");
const { s3Client } = require("../../libs/s3-client");

const CryptoJS = require("crypto-js");

// error handler
const Boom = require("@hapi/boom");
// body validator
const Joi = require("joi");

//--------joi schema-----------------
const joiSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});
//--------joi schema-----------------

//configure constant
const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteImage = async (event) => {
  const userEmail = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters["name"];
  console.log("input", userEmail, imageName);

  //-----check out user input-----
  try {
    const valueValid = joiSchema.validate({
      email: userEmail,
    });
    if (valueValid.hasOwnProperty("error")) {
      throw new Error(valueValid.error.details[0].message);
    }
  } catch (err) {
    const error = Boom.badRequest("Validation error" + (err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode
    );
  }
  //-----/check out user input-----

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
