import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
// const {ListObjectsCommand} = require("@aws-sdk/client-s3");
// const {s3Client} = require('../../libs/s3-client');
const { dynamoDB } = require("../../libs/db-client");
// const ddb = require('../../libs/db-client-aws');
// const Boom = require("@hapi/boom");

//configure constatnts
const BASE_URL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`

const getImages = async (event) => {
  const userEmail = event.queryStringParameters["email"];
  console.log("input", userEmail);

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

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: `#current = :cccc`,
    ExpressionAttributeNames: {"#current": "user"},
    ExpressionAttributeValues: {":cccc":{S:userEmail}},
  };

 const results = await dynamoDB.query(params).promise();
  let res = '';
  let name;
  console.log(results, results.Items, results.Items[0].imageName.S);
  for(let i =0; i < results.Items.length; i++){
    name = results.Items[i].imageName.S;
    res+= `${name}: ${BASE_URL + name}`;
  }

  return formatJSONResponse({
      message: `${userEmail}'s images: ${res}` ,
      
  });
};

export const main = middyfy(getImages);
