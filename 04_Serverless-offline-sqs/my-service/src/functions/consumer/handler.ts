import { formatJSONResponse, formatJSONResponseError } from "@libs/api-gateway";
import { SQSEvent } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { postData } from "../../libs/db-client";

const Boom = require("@hapi/boom");

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  apiVersion: "latest",
  region: process.env.REGION,
});

const consumer = async (event: SQSEvent) => {
  try {
    const params = {
      MaxNumberOfMessages: 1,
      QueueUrl: process.env.SQS_URL,
    };
    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        postData(data.Messages[0].MD5OfBody);

        var deleteParams = {
          QueueUrl: process.env.SQS_URL,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    });
    return formatJSONResponse({
      message: "Message received and deleted successfully!",
      event,
    });
  } catch (err) {
    const error = Boom.badRequest((err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode,
    );
  }
};

export const main = middyfy(consumer);
