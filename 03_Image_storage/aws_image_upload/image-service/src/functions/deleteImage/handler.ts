// import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

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
const { dynamoDB } = require("../../libs/db-client");
// const ddb = require('../../libs/db-client-aws');

//configure environment
// const BUCKET_NAME = process.env.BUCKET_NAME;

const deleteImage = async (event) => {
  const email = event.queryStringParameters["email"];
  const imageName = event.queryStringParameters['name'];
  console.log('input', email, imageName);
  //-----delete from bucket -----
  // try{
  //   const params = { Key: imageName, Bucket: BUCKET_NAME };
  //   await s3Client.send(new DeleteObjectCommand(params));
  // }catch(err){
  //   console.log("There was an error deleting your photo: ", err.message);
  // }
  //-----/delete from bucket -----

  //-----delete from db-----
  const paramsGet = {
    TableName: process.env.TABLE_NAME,
    Key: {
      "user": {
        S: email,
      },
      "userHash": {
        S: "1",
      },
    },
    "ProjectionExpression": "images",
  };
  const results = await dynamoDB.getItem(paramsGet).promise();
  const imageArr = results.Item.images.SS;
  imageArr.splice(imageArr.indexOf(imageName), 1);
  const paramsPut = {
    Item: {
      'user': {
        S: email,
      },
      'userHash': {
        S: '1'
      },
      "images": {
        SS: imageArr
      }
    },
    TableName: process.env.TABLE_NAME,
  };
  const res = await dynamoDB.putItem(paramsPut).promise();
//-----delete from db-----

  return formatJSONResponse({
        message: `Image deleted ${res}`
      });
};

export const main = middyfy(deleteImage);
