import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
// import authMiddleware from '../../libs/auth-middleware';

import schema from './schema';

//error handler
// const Boom = require('@hapi/boom');
//body validator
// const Joi = require('joi');

//--------joi schema-----------------
// const joiSchema = Joi.object({
//   username: Joi.string()
//       .alphanum()
//       .min(3)
//       .max(30)
//       .required()
// });
//--------joi schema-----------------

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  // console.log("Event:", JSON.stringify(event));
  // if(event['type'] != 'TOKEN'){
  //   const error = Boom.badRequest('Unauthorized');
  //   error.output.statusCode = 401; 
  //   error.reformat(); 
  //   throw error;
  // }
  
  const token = event.headers['Authorization'].split(' ')[1];
  console.log(token);
  // authMiddleware(token)
  // .then(data => mydata = data)
  // .catch(err => console.log(err))

  // try {
    return formatJSONResponse({
      message: 'Successfully authorized!',
      event,
    });
  // } catch (err) {
  //   const error = Boom.badRequest((err as Error).message);
  //   error.output.statusCode = 400; 
  //   error.reformat(); 
  //   return formatJSONResponseError({
  //     message: error,
  //   }, error.output.statusCode);
  // }
};

export const main = middyfy(hello);
