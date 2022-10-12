declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUCKET_NAME: string;
      REGION: string;
      ACCESS_KEY_ID: string;
      SECRET_ACCESS_KEY: string;
      TABLE_NAME: string;
      USER_POOL_NAME: string;
      COGNITO_ARN: string;
    }
  }
}

export {};
