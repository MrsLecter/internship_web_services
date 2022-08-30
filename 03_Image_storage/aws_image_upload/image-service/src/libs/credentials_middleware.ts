import { formatJSONResponseError } from "./api-gateway";
// body validator
const Joi = require("joi");

//--------joi schema-----------------
const joiSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
//--------joi schema-----------------

export const credentialsMiddleware = () => {
  const customMiddlewareBefore = (request) => {
    const { event } = request;
    const userEmail = event.body.email;
    const userPassword = event.body.password;
    //validation
    const valueValid = joiSchema.validate({
      email: userEmail,
      password: userPassword,
    });
    //if the error has occurred
    if (valueValid.hasOwnProperty("error")) {
      return formatJSONResponseError(
        {
          message: `Invalid token`,
        },
        400
      );

    } else {
      return;
    }
  };
  return {
    before: customMiddlewareBefore,
  };
};
