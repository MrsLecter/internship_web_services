## Image S3 storage

API GW + AWS Lambda + Cognito + S3 + DynamoDB. Api picture storage. It consists of two services: authorization-service and image-service. 

## How to use

1) npm install
2) configure .env parametrs
3) sls deploy

## Image_service endpoints
- **POST** .../getimages - get all *images* with *urls* for user [email] (need: event body: {"email": [youremail], "password":[yorpassword]}, Auth Bearer Token);
- **POST** .../images - post your image to S3Bucket (neeed: image file, queryStringParams: email, password, imageName, Auth Bearer Token);
- **DELETE** .../images - delete your image from S3Bucket (need:event body: {"email": [youremail], "password":[yorpassword]}, Auth Bearer Token); 
- **GET** .../ - get *url* and *fields* for user to upload file on S3Bucket without auth (need: queryStringParams: name - is image name);

## Authorization-service endpoints
- **POST** .../signup - user registration (need: {"email":"[youremail], "password":[yourpassword]}). Service will send you an email with an authorization code
- **POST** .../signup/confirm - confirm your registration. Send your email and confirmation code;
- **POST** .../signin - login. Remember your *Access Token* and *Refresh Token*.( need: {"email":[youremail], "passord":[yourpassword]}
