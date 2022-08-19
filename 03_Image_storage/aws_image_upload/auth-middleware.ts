// import { CognitoIdentityServiceProvider } from 'aws-sdk';
// const identityServiceProvider = new CognitoIdentityServiceProvider({
//   region: process.env.REGION,
// });

// export interface IUser {
//   password: string;
//   email: string;
// }

// const authMiddleware = async(token) => {
//     const rawUser = await identityServiceProvider.getUser({ AccessToken: token }).promise();
//     console.log('rawUser', rawUser);
//     return {
//         password: rawUser.UserAttributes.find((attr) => attr.Name === 'password')?.Value!,
//         email: rawUser.UserAttributes.find((attr) => attr.Name === 'email')?.Value!,
//     }
// }


// export default authMiddleware;