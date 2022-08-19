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
  const email = event.queryStringParameters["email"];
  console.log("input", email);

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

  const params2 = {
    Key: {
      'user': {
        S: email,
      },
    },
    ProjectionExpression: 'imageName',
    TableName: process.env.TABLE_NAME,
  };

 const results = await dynamoDB.getItem(params).promise();
 const imageArr = results.Item.images.SS;
const objRes = {};
imageArr.forEach(item => {
  objRes[item] = BASE_URL+item;
})
try{
  return formatJSONResponse({
    message: 'ok',
  });
}catch(err){
  return formatJSONResponse({
    message: err,
  });
}
  
 
  // derr2 = await dynamoDB.getItem(params2).promise();
};

export const main = middyfy(getImages);
