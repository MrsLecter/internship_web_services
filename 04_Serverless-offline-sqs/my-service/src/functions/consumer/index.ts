import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "consumer",
      },
      sqs: {
        QueueName: "queue1",
        batchSize: 1,
        arn: {
          "Fn::GetAtt": ["queue1", process.env.SQS_ARN],
        },
      },
    },
  ],
};
