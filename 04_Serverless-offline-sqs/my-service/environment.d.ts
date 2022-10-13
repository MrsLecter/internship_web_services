declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_ENDPOINT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      SQS_URL: string;
      SQS_REDIRECT_URL: string;
      SQS_NAME: string;
      SQS_ARN: string;
      SQS_REDIRECT_ARN: string;
      REGION: string;
    }
  }
}

export {};
