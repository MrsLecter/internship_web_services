import {formatJSONResponse,formatJSONResponseError} from "../../libs/api-gateway";
const { ListObjectsCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
import { middyfy } from "../../libs/lambda";
const CryptoJS = require('crypto-js');

const { s3Client } = require("../../libs/s3-client");
const { dynamoDB } = require("../../libs/db-client");

//error handler
const Boom = require("@hapi/boom");

const postImage = async (event) => {

  const userEmail = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters["name"];
    
  //-----post in db-----
  try{
    const paramsPUT = {
      Item: {
        "user": {
          S: userEmail,
        },
        "imageHash": {
          S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
        },
        "imageName": {
          S: imageName,
        },
      },
      TableName: process.env.TABLE_NAME,
    };

    await dynamoDB.putItem(paramsPUT).promise();
  }catch(err){
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
  //-----/post in db-----

  //-----post in bucket-----
  try {
    await s3Client.send(
      new ListObjectsCommand({
        Bucket: process.env.BUCKET_NAME,
      })
    );
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: event.body,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("Successfully uploaded photo.");
    } catch (err) {
      const error = Boom.badRequest(
        "There was an error uploading your photo: " + (err as Error).message
      );
      error.output.statusCode = 400;
      error.reformat();
      return formatJSONResponseError(
        {
          message: error,
        },
        error.output.statusCode
      );
    }
  } catch (err) {
    const error = Boom.badRequest((err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode
    );
  }
  //-----/post in bucket-----

  return formatJSONResponse({
    message: `Image [${imageName}] added by [${userEmail}] to bucket `,
  });
};


export const main = middyfy(postImage);
