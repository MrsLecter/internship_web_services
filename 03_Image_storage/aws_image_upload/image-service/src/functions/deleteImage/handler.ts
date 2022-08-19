// import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
const { dynamoDB } = require("../../libs/db-client");
const CryptoJS = require('crypto-js');

// import schema from './schema';

//error handler
// const Boom = require('@hapi/boom');
//body validator
// const Joi = require('joi');

//--------joi schema-----------------
// const joiSchema = Joi.object({
//   username: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(30)
//       .required()
// });
//--------joi schema-----------------
// const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
// const {s3Client} = require('../../libs/s3-client');

// const ddb = require('../../libs/db-client-aws');

//configure environment
// const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteImage = async (event) => {
  const userEmail = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters['name'];
  console.log('input', userEmail, imageName);
  //-----delete from bucket -----
  // try{
  //   const params = { Key: imageName, Bucket: BUCKET_NAME };
  //   await s3Client.send(new DeleteObjectCommand(params));
  // }catch(err){
  //   console.log("There was an error deleting your photo: ", err.message);
  // }
  //-----/delete from bucket -----

  //-----delete from db-----
  const paramsDelete = {
    Key: {
      "user": {
        S: userEmail,
      },
      "imageHash": {
        S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
      },
    },
    TableName: process.env.TABLE_NAME,
  };
  await dynamoDB.deleteItem(paramsDelete).promise();
//-----delete from db-----
  return formatJSONResponse({
        message: `Image [${imageName}] deleted by user [${userEmail}]`
      });
};

export const main = middyfy(deleteImage);
