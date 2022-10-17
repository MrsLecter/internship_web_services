import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { badImplementation } from "@hapi/boom";

class s3Helper {
  public s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  public async uploadImage(imageName: string, body: string) {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: body,
    };
    await this.s3Client
      .send(new PutObjectCommand(uploadParams))
      .catch((error) => {
        console.error("There was an error in the method s3Client.uploadImage");
        throw badImplementation(error);
      });
  }

  public async getPresignedPost(imageName: string) {
    const BUCKET_PREFIX = "/";
    const Fields = {
      acl: "public-read",
    };
    const Conditions = [
      { acl: "public-read", bucket: process.env.BUCKET_NAME },
    ];
    const urlObject = await createPresignedPost(this.s3Client, {
      Bucket: process.env.BUCKET_NAME,
      Key: `${BUCKET_PREFIX}-${(Math.random() + 1)
        .toString(36)
        .substring(2)}-${imageName}`,
      Conditions: Conditions,
      Fields: Fields,
      Expires: 3600,
    });
    return urlObject;
  }

  public async deleteImage(imageName: string) {
    const params = { Key: imageName, Bucket: process.env.BUCKET_NAME };
    await this.s3Client.send(new DeleteObjectCommand(params)).catch((error) => {
      console.error("There was an error in the method s3Client.deleteItem");
      throw badImplementation(error);
    });
  }
}

export default new s3Helper();
