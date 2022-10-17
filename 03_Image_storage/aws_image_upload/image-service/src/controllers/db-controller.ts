import * as CryptoJS from "crypto-js";
import * as sdk from "aws-sdk";
import { badImplementation } from "@hapi/boom";

class DatabaseHelper {
  public dbClient: sdk.DynamoDB;

  constructor() {
    this.dbClient = new sdk.DynamoDB({
      apiVersion: "2012-08-10",
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION,
      maxRetries: 1,
      maxRedirects: 1,
    });
  }

  public async postImage(userEmail: string, imageName: string): Promise<void> {
    const paramsPUT = {
      Item: {
        user: {
          S: userEmail,
        },
        imageHash: {
          S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
        },
        imageName: {
          S: imageName,
        },
      },
      TableName: process.env.TABLE_NAME,
    };

    await this.dbClient
      .putItem(paramsPUT)
      .promise()
      .catch((error) => {
        console.error("There was an error in the method dbClient.postImage");
        throw badImplementation(error);
      });
  }

  public async getImages(userEmail: string) {
    const params: sdk.DynamoDB.Types.QueryInput = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: `#current = :cccc`,
      ExpressionAttributeNames: { "#current": "user" },
      ExpressionAttributeValues: { ":cccc": { S: userEmail as string } },
    };
    return await this.dbClient.query(params).promise();
  }

  public async deleteImage(imageName: string, userEmail: string) {
    const paramsDelete = {
      Key: {
        user: {
          S: userEmail,
        },
        imageHash: {
          S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
        },
      },
      TableName: process.env.TABLE_NAME,
    };
    await this.dbClient
      .deleteItem(paramsDelete)
      .promise()
      .catch((error) => {
        console.error("There was an error in the method dbClient.deleteImage");
        throw badImplementation(error);
      });
  }
}

export default new DatabaseHelper();
