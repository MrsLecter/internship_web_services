const { dynamoDB } = require("./db-client");
const CryptoJS = require("crypto-js");

export const deleteImagePromise = async (userEmail, imageName) => {
  const paramsDelete = {
    Key: {
      user: {
        S: userEmail,
      },
      imageHash: {
        S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
      },
    },
    TableName: process.env.TABLE_NAME,
  };
  console.log(
    userEmail,
    CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
    imageName,
  );
  await dynamoDB.deleteItem(paramsDelete).promise();
};

export const postImagePromise = async (userEmail, imageName) => {
  const paramsPUT = {
    Item: {
      user: {
        S: userEmail,
      },
      imageHash: {
        S: CryptoJS.SHA256(imageName).toString(CryptoJS.enc.Base64),
      },
      imageName: {
        S: imageName,
      },
    },
    TableName: process.env.TABLE_NAME,
  };

  await dynamoDB.putItem(paramsPUT).promise();
};
