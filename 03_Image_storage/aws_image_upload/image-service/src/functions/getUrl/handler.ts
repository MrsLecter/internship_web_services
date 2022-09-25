import { formatJSONResponse } from "../../libs/api-gateway";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import middy from "@middy/core";

const { s3Client } = require("../../libs/s3-client");

const BUCKET_PREFIX = "/";
const Fields = {
  acl: "public-read",
};
const Conditions = [{ acl: "public-read", bucket: process.env.BUCKET_NAME }];

const getUrl = async (event) => {
  const imageName = event.queryStringParameters["name"];
  console.log("input", imageName);

  //Users without AWS credentials can use the URL and fields to to make a POST request to S3.
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME,
    Key: `${BUCKET_PREFIX}-${(Math.random() + 1)
      .toString(36)
      .substring(2)}-${imageName}`,
    Conditions: Conditions,
    Fields: Fields,
    Expires: 3600,
  });

  return formatJSONResponse({
    message: `Url to upload: ${url}, fields: ${fields}`,
  });
};

export const main = middy(getUrl).use(middyJsonBodyParser());
