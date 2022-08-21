import {formatJSONResponse,formatJSONResponseError} from "../../libs/api-gateway";
// import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
const { ListObjectsCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
import { middyfy } from "../../libs/lambda";
const CryptoJS = require('crypto-js');

const { s3Client } = require("../../libs/s3-client");
const { dynamoDB } = require("../../libs/db-client");

//error handler
const Boom = require("@hapi/boom");
//body validator
const Joi = require("joi");

//configure constants
// const imageURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`;
// const BUCKET_PREFIX = "/";
// const Fields = {
  // acl: "public-read",
// };
// const Conditions = [{ acl: "public-read", bucket: process.env.BUCKET_NAME }];

// --------joi schema-----------------
const joiSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  // access_token: [Joi.string(),Joi.number()],
});
// --------joi schema-----------------

const postImage = async (event) => {
  const userEmail = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters["name"];
  console.log('input', userEmail, imageName);  
  // const token = event.headers['Authorization'].split(' ')[1];

  // -----check out user input-----
  try {
    const valueValid = joiSchema.validate({
      email: userEmail,
      // access_token: token
    });
    if (valueValid.hasOwnProperty("error")) {
      throw new Error(valueValid.error.details[0].message);
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
  //-----/check out user input-----


  //-----post to bucket url-----
  // const s3Params = {
  //   Bucket: process.env.BUCKET_NAME,
  //   Key:`${BUCKET_PREFIX}-${(Math.random() + 1)
  //     .toString(36)
  //     .substring(2)}-${imageName}`,
  //   Expires: 3600,
  //   ContentType: 'image/jpeg'
  // }
  // const AWS = require('aws-sdk')
  // AWS.config.update({ region: process.env.REGION })
  // const s3 = new AWS.S3()
  // const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  // console.log('upload url',uploadURL );

  //Users without AWS credentials can use the URL and fields to to make a POST request to S3.
  // const { url, fields } = await createPresignedPost(s3Client, {
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: `${BUCKET_PREFIX}-${(Math.random() + 1)
  //     .toString(36)
  //     .substring(2)}-${imageName}`,
  //   Conditions: Conditions,
  //   Fields: Fields,
  //   Expires: 3600, //Seconds before the presigned post expires. 3600 by default.
  // });
  // console.log('createPresignedPost',url, fields )
    //-----/post to bucket url-----
  
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
