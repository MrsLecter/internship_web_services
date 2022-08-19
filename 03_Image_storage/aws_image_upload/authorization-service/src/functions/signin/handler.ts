import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse, formatJSONResponseError } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import cognitoRoutes from '../../libs/cognito-routes';

import schema from './schema';

//error handler
const Boom = require('@hapi/boom');
//body validator
const Joi = require('joi');

//--------joi schema-----------------
const joiSchema = Joi.object({
  email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'me'] } }),
  password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});
//--------joi schema-----------------

const signin: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const email = event.body.email;
  const password = event.body.password;
  
  //-----check out user input-----
  try{
    const valueValid =joiSchema.validate({ email: email, password: password });
    if(valueValid.hasOwnProperty('error')){
      throw new Error(valueValid.error.details[0].message)
    }
  }catch(err){
    const error = Boom.badRequest((err as Error).message);
    error.output.statusCode = 400; 
    error.reformat(); 
    return formatJSONResponseError({
      message: error
    }, error.output.statusCode);
  }
  //-----/check out user input-----
  
  console.log('email', email, 'password', password)
  return cognitoRoutes.signIn({ email, password })
    .then(data => {
      return formatJSONResponse({
        message: data,
      });
    })
    .catch(err =>{
      return formatJSONResponseError({
        message: err
      }, 400);
    })
};

export const main = middyfy(signin);
