import { formatJSONResponse, formatJSONResponseError } from "../../libs/api-gateway";
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from "../../libs/lambda";
const { dynamoDB } = require("../../libs/db-client");

import schema from './schema';

// error handler
const Boom = require("@hapi/boom");

//configure constatnts
const BASE_URL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`


const getImages: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userEmail = event.body.email;
  
  //-----get info from s3bucket-----
  // const data = await s3Client.send(
  //   new ListObjectsCommand({
  //     Bucket: process.env.BUCKET_NAME,
  //   })
  // );

  //result photo storage
  // let photos = {};

  // //format data
  // console.log(data.Contents)
  // data.Contents.forEach(function (photo) {
  //   const key = photo.Key.match(/[a-zA-Z0-9_]+/gm)[0];
  //   if(key){
  //     const url = BASE_URL+photo.Key;
  //     photos[key] = url;
  //   }
  // });
  //-----/get info from s3bucket-----

  //-----ask db about users photos-----
  let results;
  try{
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: `#current = :cccc`,
      ExpressionAttributeNames: {"#current": "user"},
      ExpressionAttributeValues: {":cccc":{S:userEmail}},
    };
    results = await dynamoDB.query(params).promise();
  }catch(err){
    const error = Boom.badRequest('DynamoDB error' +(err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode
    );
  }
  //-----ask db about users photos-----

  let res = '';
  let name;
  //transform results
  for(let i =0; i < results.Items.length; i++){
    name = results.Items[i].imageName.S;
    res+= `${name}: ${BASE_URL + name}`;
  }

  return formatJSONResponse({
      message: `${userEmail}'s images: ${res}` ,
      
  });
};

export const main = middyfy(getImages);
