// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: process.env.REGION,
});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.REGION,
    credentials: {
      client: { region: process.env.REGION},
      accessKeyId: process.env.ACCESS_KEY_ID, 
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },

});

export {ddb};
