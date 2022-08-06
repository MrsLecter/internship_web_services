import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

//error handler
const Boom = require('@hapi/boom');
//body validator
const Joi = require('joi');

//--------joi schema-----------------
const joiSchema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
});
//--------joi schema-----------------

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const name = event.body.name;
  try {
    const valueValid = joiSchema.validate({ username: name });
    if(valueValid.hasOwnProperty('error')){
      throw new Error(valueValid.error.details[0].message)
    }
    return formatJSONResponse({
      message: `Hello ${valueValid.value.username} to the exciting Serverless world!`,
      event,
    });
  } catch (err) {
    const error = Boom.badRequest((err as Error).message);
    error.output.statusCode = 400; 
    error.reformat(); 
    throw error;
  }
};

export const main = middyfy(hello);
