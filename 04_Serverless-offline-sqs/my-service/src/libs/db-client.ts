import * as mysql from "mysql";
import { v4 } from "uuid";

const connection = mysql.createConnection({
  host: process.env.DB_ENDPOINT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const getData = async () => {
  const data = await new Promise((resolve, reject) => {
    connection.connect();
    connection.query("SELECT * FROM sqsmessages;", (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    connection.end();
  });
  return data;
};

export const postData = async (token: string) => {
  const data = await new Promise((resolve, reject) => {
    connection.connect();
    connection.query(
      `INSERT INTO sqsmessages (id, message) VALUES ('${v4()}', '${token}');`,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
  connection.end();
  return data;
};
