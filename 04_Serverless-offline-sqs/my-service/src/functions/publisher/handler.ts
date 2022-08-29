import { formatJSONResponse, formatJSONResponseError } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

// error handler
const Boom = require("@hapi/boom");

// Create an SQS service object on the elasticmq endpoint
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  apiVersion: "latest",
  region: process.env.REGION,
});

const publisher = async (event) => {
  const body = event.body;
  try{
  const params={
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify({
        user: body.user,
        token: body.token,
      }),
    }
    // Send a message into SQS
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
    
    return formatJSONResponse({
      message: `Published successfully!`,
      event,
    });
  }catch(err){
    const error = Boom.badRequest("S3Client error" + (err as Error).message);
    error.output.statusCode = 400;
    error.reformat();
    return formatJSONResponseError(
      {
        message: error,
      },
      error.output.statusCode
    );
  }
};

export const main = middyfy(publisher);
