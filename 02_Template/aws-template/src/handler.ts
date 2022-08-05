"use strict";
// import Boom from '@hapi/boom';
import middy from '@middy/core';

// const Joi = require('joi');

// const schema = Joi.object({
//   username: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(30)
//       .required()
// });


const lambdaHandler= async (event:any) => {
  // let name;
  // try {
  //   name = schema.validate({ username: event.queryStringParameters['name'] });
  // }catch (err) {
      // const error = Boom.badRequest((err as Error).message);
      // error.output.statusCode = 400;    // Assign a custom error code
      // error.reformat();
      // throw error;
  // }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello, ${event.queryStringParameters['name']}`,
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.hello = middy().handler(lambdaHandler);