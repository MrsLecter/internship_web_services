const { S3Client } = require("@aws-sdk/client-s3");

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      client: { region: process.env.REGION},
      accessKeyId: process.env.ACCESS_KEY_ID, 
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
export { s3Client };

