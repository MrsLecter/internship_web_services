declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USER_POOL_ID: string;
      CLIENT_ID: string;
    }
  }
}

export {};
