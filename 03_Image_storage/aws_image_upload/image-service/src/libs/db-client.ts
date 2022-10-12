import * as sdk from "aws-sdk";

export const dynamoDB = new sdk.DynamoDB({
  apiVersion: "2012-08-10",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
  maxRetries: 1,
  maxRedirects: 1,
});
