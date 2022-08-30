import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

import {authMiddleware} from "./auth-middleware";
import {credentialsMiddleware} from "./credentials_middleware";

export const middyfy = (lambdaHandler) => {
  return middy(lambdaHandler).use(middyJsonBodyParser()).use(credentialsMiddleware()).use(authMiddleware());
} 